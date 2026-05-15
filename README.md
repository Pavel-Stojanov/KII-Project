# Library API

A library management system built with Spring Boot, React, and MongoDB.

## Stack
- **Backend**: Spring Boot 4, Spring Data MongoDB, Spring Security + JWT
- **Frontend**: React 19, TypeScript, Vite, Material UI
- **Database**: MongoDB 7

## Running locally

### Docker Compose
```bash
docker compose up --build
```
Access the app at http://localhost

### Kubernetes (k3d)
```bash
k3d cluster create mycluster --port "80:80@loadbalancer" --port "443:443@loadbalancer" --k3s-arg "--disable=traefik@server:0"
kubectl apply -f k8s/ --recursive
echo "127.0.0.1 library.local" | sudo tee -a /etc/hosts
```
Access the app at http://library.local
