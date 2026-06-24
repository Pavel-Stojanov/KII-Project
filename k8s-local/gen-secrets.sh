#!/usr/bin/env bash
# Generates the plain (gitignored) Secret manifests for the LOCAL k3d stack.
# These are throwaway dev credentials — never used on AKS, never committed.
# Run once before `kubectl apply -k k8s-local/`.
set -euo pipefail
cd "$(dirname "$0")"

USER="emc"
PASS="emc"
KEYFILE=$(openssl rand -base64 756 | tr -d '\n')
JWT=$(openssl rand -base64 32)

URI="mongodb://${USER}:${PASS}@mongodb-0.mongodb.library-api.svc.cluster.local:27017,mongodb-1.mongodb.library-api.svc.cluster.local:27017,mongodb-2.mongodb.library-api.svc.cluster.local:27017/library-db?replicaSet=rs0&authSource=admin"

cat > mongodb/secret.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: mongodb-secret
  namespace: library-api
type: Opaque
stringData:
  MONGO_INITDB_ROOT_USERNAME: ${USER}
  MONGO_INITDB_ROOT_PASSWORD: ${PASS}
EOF

cat > mongodb/keyfile.secret.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: mongodb-keyfile
  namespace: library-api
type: Opaque
stringData:
  keyfile: "${KEYFILE}"
EOF

cat > backend/secret.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: backend-secret
  namespace: library-api
type: Opaque
stringData:
  JWT_SECRET_KEY: "${JWT}"
  SPRING_MONGODB_URI: "${URI}"
EOF

echo "generated: mongodb/secret.yaml, mongodb/keyfile.secret.yaml, backend/secret.yaml (gitignored)"
