# Library API

A library management system for tracking books, authors, and countries, with JWT
authentication and per-category statistics. The project demonstrates a full
containerized, continuously-delivered stack: three services (frontend, backend,
database) packaged as Docker images, orchestrated locally with Docker Compose,
deployed to Kubernetes, and continuously delivered through a GitOps pipeline.

## Stack

- **Backend** — Spring Boot 4, Spring Data MongoDB, Spring Security + JWT (port 8080)
- **Frontend** — React 19 + TypeScript + Vite, served by nginx (port 80)
- **Database** — MongoDB 7

## Repository layout

| Path | What it is |
| --- | --- |
| `src/`, `pom.xml`, `Dockerfile` | Spring Boot backend and its container image |
| `frontend/`, `frontend/Dockerfile`, `frontend/nginx.conf` | React app, its nginx image, and reverse-proxy config |
| `docker-compose.yaml` | Local three-service stack (frontend + backend + MongoDB) |
| `k8s/` | Kubernetes manifests, assembled with Kustomize |
| `argocd/application.yaml` | Argo CD `Application` defining the GitOps deployment |
| `.github/workflows/ci-cd.yml` | CI/CD pipeline (build, push, image-tag bump) |

## Containerization

Each service ships as its own image:

- **Backend** (`Dockerfile`) — multi-stage Maven build producing a slim JRE runtime image.
- **Frontend** (`frontend/Dockerfile`) — builds the Vite bundle, then serves it with nginx.
  The frontend's API client uses a relative `/api` base URL, so the same image works
  behind any hostname or IP without rebuilding.

Images are published to Docker Hub as `frikzy/library-api-backend` and
`frikzy/library-api-frontend`, each tagged with `latest` and the commit SHA,
built for `linux/amd64`.

## Running locally

### Docker Compose

```bash
docker compose up --build
```

Brings up all three services and exposes the app at http://localhost.

### Kubernetes (local, via k3d)

```bash
k3d cluster create mycluster --port "80:80@loadbalancer" --port "443:443@loadbalancer" --k3s-arg "--disable=traefik@server:0"
kubectl apply -k k8s/
```

The Ingress has no host set, so the app is reachable directly at http://localhost.

## Kubernetes manifests (`k8s/`)

All resources live in a dedicated `library-api` namespace and are assembled by
`k8s/kustomization.yaml`, which also holds the image tags that CI bumps on each release.

| Resource | Files | Role |
| --- | --- | --- |
| **Namespace** | `namespace.yaml` | Isolates every resource under `library-api`. |
| **StatefulSet** + headless Service | `mongodb/statefulset.yaml`, `mongodb/service.yaml` | MongoDB with a `volumeClaimTemplate` PVC for durable storage and stable identity. |
| ConfigMap + Secret | `mongodb/configmap.yaml`, `mongodb/secret.yaml` | MongoDB non-secret settings and credentials. |
| **Deployment** (backend, 2 replicas) | `backend/deployment.yaml` | Spring Boot API with readiness/liveness probes on `/actuator/health`. |
| ConfigMap + Secret | `backend/configmap.yaml`, `backend/secret.yaml` | Backend app config, DB connection, and JWT secret, injected via `envFrom`. |
| **Service** (backend, ClusterIP) | `backend/service.yaml` | In-cluster access on `:8080`. |
| **Deployment** (frontend, 2 replicas) | `frontend/deployment.yaml` | nginx serving the React bundle. |
| **Service** (frontend, ClusterIP) | `frontend/service.yaml` | In-cluster access on `:80`. |
| **Ingress** | `ingress.yaml` | Routes `/api`, `/swagger-ui`, `/v3/api-docs`, `/actuator` to the backend and everything else (`/`) to the frontend. |

The MongoDB PVC requests no explicit `storageClassName`, so it binds to whatever
default StorageClass the cluster provides (`local-path` on k3s/k3d, `managed-csi`
on AKS).

## CI/CD pipeline (GitHub Actions → Argo CD)

`.github/workflows/ci-cd.yml` runs on every push to `main`:

1. Builds the backend and frontend Docker images (multi-stage — Maven/Vite compile
   from source inside the image) and pushes them to Docker Hub for `linux/amd64`,
   tagged with both `latest` and the commit SHA.
2. Bumps the image tags in `k8s/kustomization.yaml` (via `kustomize edit set image`)
   to the new commit SHA and commits that change back to `main`.

**Argo CD**, running inside the cluster, watches the `k8s/` path of this repo and
auto-syncs. When step 2's commit lands, Argo CD performs a rolling update, so the
cluster state always matches Git (GitOps). CI never needs credentials to the cluster.

```
push to main
   │
   ├─ build + push images to Docker Hub
   └─ bump image tag in k8s/ + commit back to main
                      │
        Argo CD (in cluster) detects the change
                      │
              sync → rolling update
```

The pipeline relies on two repository settings: the `DOCKERHUB_USERNAME` /
`DOCKERHUB_TOKEN` secrets, and **Read and write** workflow permissions (so CI can
push the tag-bump commit — commits made with the built-in token do not re-trigger
the workflow, avoiding a loop).

## Deployment environment (Azure Kubernetes Service)

The app is deployed publicly on a managed AKS cluster. The GitOps design makes the
deployment cluster-agnostic — only the bootstrap below is environment-specific; the
manifests, pipeline, and Argo CD `Application` are unchanged across clusters.

**Cluster bootstrap** (one-time): create the AKS cluster, then install an
ingress-nginx controller (which provisions an Azure LoadBalancer with a public IP)
and Argo CD, and register the application:

```bash
az aks create -g library-api -n library-api --location swedencentral \
  --node-count 1 --node-vm-size Standard_D2s_v3 --generate-ssh-keys
az aks get-credentials -g library-api -n library-api

helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz

kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl apply -f argocd/application.yaml
```

> Azure for Students restricts both regions and VM SKUs to a per-subscription
> allow-list; `swedencentral` + `Standard_D2s_v3` is one valid combination. List
> what a subscription permits with
> `az vm list-skus --location <region> --resource-type virtualMachines --all --query "[?restrictions[0]==null].name" -o tsv`.

The `azure-load-balancer-health-probe-request-path=/healthz` annotation is required:
because the Ingress is host-based, the Azure LoadBalancer's default HTTP health probe
to `/` would get a 404 (no matching host on a bare probe request) and mark the node
unhealthy, so it must probe ingress-nginx's always-200 `/healthz` endpoint instead.

TLS is handled by **cert-manager**: install it once
(`kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml`),
and the `letsencrypt-prod` ClusterIssuer (`k8s/clusterissuer.yaml`) obtains a Let's
Encrypt certificate for the Ingress host via an HTTP-01 challenge. The app is served
over HTTPS at the Ingress host — a `nip.io` name mapped to the ingress controller's
public IP (`kubectl get svc -n ingress-nginx ingress-nginx-controller`), so no
external DNS is required.

The Argo CD dashboard can be reached by port-forwarding `svc/argocd-server` in the
`argocd` namespace (initial password: the `argocd-initial-admin-secret`, user `admin`).
