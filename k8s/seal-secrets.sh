#!/usr/bin/env bash
# Seals the raw (gitignored) Secret manifests into SealedSecrets safe to commit.
#
# Requires: the sealed-secrets controller installed in the cluster + the kubeseal CLI.
# Run with kubectl pointed at the TARGET cluster — the controller key is
# cluster-specific, so a SealedSecret sealed for one cluster won't decrypt in another.
#
# Usage: ./seal-secrets.sh
set -euo pipefail
cd "$(dirname "$0")"

command -v kubeseal >/dev/null || { echo "kubeseal not found — install it first"; exit 1; }

# Adjust if you installed the controller elsewhere (Helm default differs from the
# raw-manifest default of kube-system / sealed-secrets-controller).
CONTROLLER_NS="${SEALED_SECRETS_NS:-kube-system}"
CONTROLLER_NAME="${SEALED_SECRETS_NAME:-sealed-secrets-controller}"

# Generate the replica-set keyfile secret on first run.
if [ ! -f mongodb/keyfile.secret.yaml ]; then
  echo "generating mongodb/keyfile.secret.yaml"
  KEYFILE=$(openssl rand -base64 756 | tr -d '\n')
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
fi

seal() {
  local raw="$1" out="$2"
  [ -f "$raw" ] || { echo "missing $raw (copy from ${raw%.yaml}.example.yaml and fill it in)"; exit 1; }
  echo "sealing $raw -> $out"
  kubeseal --controller-namespace "$CONTROLLER_NS" --controller-name "$CONTROLLER_NAME" \
    --format yaml < "$raw" > "$out"
}

seal backend/secret.yaml          backend/sealedsecret.yaml
seal mongodb/secret.yaml          mongodb/sealedsecret.yaml
seal mongodb/keyfile.secret.yaml  mongodb/keyfile.sealedsecret.yaml

echo
echo "Done. Commit the *.sealedsecret.yaml files. Keep *.secret.yaml gitignored."
