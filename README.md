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

Secrets are read from a gitignored `.env` file (never committed). Create one from
the template before the first run:

```bash
cp .env.example .env   # then edit .env and set real values
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
| **StatefulSet** (mongodb, 3 replicas) + headless Service | `mongodb/statefulset.yaml`, `mongodb/service.yaml` | 3-member MongoDB replica set (`rs0`) with a per-pod `volumeClaimTemplate` PVC and stable network identity. Members authenticate to each other with a shared keyfile. |
| **Job** (replica-set init) | `mongodb/rs-init-job.yaml` | Argo CD `PostSync` hook that idempotently runs `rs.initiate()` once all 3 members are reachable. |
| ConfigMap + SealedSecret(s) | `mongodb/configmap.yaml`, `mongodb/sealedsecret.yaml`, `mongodb/keyfile.sealedsecret.yaml` | MongoDB settings, root credentials, and the replica-set keyfile (the secrets are encrypted — see [Secrets](#secrets-sealed-secrets)). |
| **Deployment** (backend, 3 replicas) | `backend/deployment.yaml` | Spring Boot API with readiness/liveness probes on `/actuator/health`. |
| ConfigMap + SealedSecret | `backend/configmap.yaml`, `backend/sealedsecret.yaml` | Backend config, the replica-set connection string, and the JWT secret, injected via `envFrom`. |
| **Service** (backend, ClusterIP) | `backend/service.yaml` | In-cluster access on `:8080`. |
| **Deployment** (frontend, 3 replicas) | `frontend/deployment.yaml` | nginx serving the React bundle. |
| **Service** (frontend, ClusterIP) | `frontend/service.yaml` | In-cluster access on `:80`. |
| **Ingress** | `ingress.yaml` | Routes `/api`, `/swagger-ui`, `/v3/api-docs`, `/actuator` to the backend and everything else (`/`) to the frontend. |

The MongoDB PVC requests no explicit `storageClassName`, so it binds to whatever
default StorageClass the cluster provides (`local-path` on k3s/k3d, `managed-csi`
on AKS).

### MongoDB replica set

MongoDB runs as a 3-member replica set (`rs0`) rather than a single instance, so the
database survives losing a pod (a 3-member set keeps a writable primary as long as
two members are up). The StatefulSet starts each `mongod` with `--replSet rs0` and a
shared `--keyFile` for member authentication; `mongodb/rs-init-job.yaml` then runs
`rs.initiate()` as an Argo CD `PostSync` hook. The backend's `SPRING_MONGODB_URI`
lists all three members and `replicaSet=rs0`.

**Cutover on a cluster that already ran the old single-node MongoDB:** the root
password lives in the existing PVC and `MONGO_INITDB_*` only seeds it on an *empty*
data dir, so the rotated credentials and the replica set won't initialize over old
data. Wipe the MongoDB volumes once at cutover (the demo data is re-created by the
backend's `DataSeeder` on startup):

```bash
kubectl delete statefulset mongodb -n library-api
# The PVCs are named mongodb-data-mongodb-<n> and are NOT deleted with the
# StatefulSet — remove them explicitly to wipe the old data:
kubectl get pvc -n library-api | grep mongodb-data
kubectl delete pvc -n library-api mongodb-data-mongodb-0   # repeat per replica
# Argo CD then recreates the StatefulSet, fresh PVCs, and runs the init hook.
```

If the init hook ever needs to be run by hand:

```bash
kubectl exec -n library-api mongodb-0 -- mongosh \
  -u <root-user> -p <root-pass> --authenticationDatabase admin \
  --eval 'rs.initiate({_id:"rs0",members:[
    {_id:0,host:"mongodb-0.mongodb.library-api.svc.cluster.local:27017"},
    {_id:1,host:"mongodb-1.mongodb.library-api.svc.cluster.local:27017"},
    {_id:2,host:"mongodb-2.mongodb.library-api.svc.cluster.local:27017"}]})'
```

### Secrets (Sealed Secrets)

No plaintext secret is committed. Raw `Secret` manifests (`k8s/**/secret.yaml`,
`k8s/mongodb/keyfile.secret.yaml`) are **gitignored**; only their encrypted
[Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) counterparts
(`*.sealedsecret.yaml`) are committed. The sealed-secrets controller in the cluster
is the only thing that can decrypt them, producing the real `Secret`s at runtime.

One-time setup, and whenever a secret value changes:

```bash
# 1. Install the controller in the target cluster (once).
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/latest/download/controller.yaml
# 2. Install the kubeseal CLI (macOS): brew install kubeseal

# 3. Fill in the raw, gitignored secret sources from the templates:
cp k8s/backend/secret.example.yaml  k8s/backend/secret.yaml    # edit values
cp k8s/mongodb/secret.example.yaml  k8s/mongodb/secret.yaml    # edit values
#    (the replica-set keyfile is generated automatically by the script)

# 4. Seal them against the running cluster, then commit only the sealed output.
./k8s/seal-secrets.sh
git add k8s/**/*.sealedsecret.yaml
```

> Sealing is cluster-specific: a SealedSecret is encrypted with one cluster's
> controller key and will not decrypt in another. Re-seal after recreating a cluster.

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

# Install the sealed-secrets controller and seal the secrets for THIS cluster
# (see "Secrets" above) before registering the app, or the first sync has no
# Secrets to decrypt.
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/latest/download/controller.yaml
./k8s/seal-secrets.sh   # commit & push the resulting *.sealedsecret.yaml

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
