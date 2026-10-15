#!/bin/bash
# Upload an image to R2 and return the public URL
# Usage: ./scripts/upload-image.sh <image_path_or_url> [slug]
#
# If given a URL, downloads it first.
# If given a local file, uploads it directly.
# Slug is optional — derived from filename or timestamp if omitted.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TMPDIR="${TMPDIR:-/tmp}"
SOURCE="$1"
SLUG="${2:-img-$(date +%Y%m%d-%H%M%S)}"

# Load credentials
source "$PROJECT_DIR/.env.r2" 2>/dev/null || {
  echo "Error: .env.r2 not found. Create it with CLOUDFLARE_API_TOKEN, R2_ACCOUNT_ID, R2_BUCKET, R2_PUBLIC_URL"
  exit 1
}

# Handle URLs vs local files
if [[ "$SOURCE" =~ ^https?:// ]]; then
  echo "  → Downloading $SOURCE ..." >&2
  # Detect extension from URL
  EXT=$(echo "$SOURCE" | sed -n 's/.*\.\(jpg\|jpeg\|png\|gif\|webp\|avif\|svg\)\([?#].*\)\{0,1\}$/\1/p')
  [ -z "$EXT" ] && EXT="jpg"
  LOCAL_FILE="$TMPDIR/r2-upload-$$.$EXT"
  curl -sfL -o "$LOCAL_FILE" "$SOURCE" || { echo "Error: Download failed"; exit 1; }
elif [ -f "$SOURCE" ]; then
  LOCAL_FILE="$SOURCE"
else
  echo "Error: source '$SOURCE' is neither a URL nor a local file"
  exit 1
fi

# Detect MIME type
MIME=$(file --mime-type -b "$LOCAL_FILE" 2>/dev/null || echo "image/jpeg")
FILENAME="${SLUG}-$(date +%s).${LOCAL_FILE##*.}"

# Upload via Cloudflare API v4, with an R2 S3-compatible API fallback.
# The CF path depends on the shared CLOUDFLARE_API_TOKEN, which can be revoked or
# invalid fleet-wide (2026-10-15: "Invalid API Token" broke hero uploads on every
# blog). The R2 access keys are separate credentials and usually still valid.
echo "  → Uploading $FILENAME ..." >&2
PUBLIC_URL="${R2_PUBLIC_URL}/${FILENAME}"
UPLOADED=""

if [ -n "${CLOUDFLARE_API_TOKEN:-}" ]; then
  RESPONSE=$(curl -s -X PUT \
    "https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${FILENAME}" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: ${MIME}" \
    --data-binary @"${LOCAL_FILE}")
  if echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
    UPLOADED="cloudflare-api"
  else
    echo "  Cloudflare API upload failed — falling back to R2 S3 API" >&2
  fi
else
  echo "  CLOUDFLARE_API_TOKEN not set — using R2 S3 API" >&2
fi

if [ -z "$UPLOADED" ]; then
  if [ -n "${R2_ACCESS_KEY_ID:-}" ] && [ -n "${R2_SECRET_ACCESS_KEY:-}" ]; then
    S3_CODE=$(curl -s -X PUT \
      "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${FILENAME}" \
      --aws-sigv4 "aws:amz:auto:s3" \
      --user "${R2_ACCESS_KEY_ID}:${R2_SECRET_ACCESS_KEY}" \
      -H "Content-Type: ${MIME}" \
      --data-binary @"${LOCAL_FILE}" \
      -o /dev/null -w "%{http_code}" || echo "000")
    if [ "$S3_CODE" = "200" ]; then
      UPLOADED="r2-s3"
    else
      echo "  R2 S3 upload failed (HTTP ${S3_CODE})" >&2
    fi
  else
    echo "  R2 S3 keys absent from .env.r2 — no fallback available" >&2
  fi
fi

if [ -z "$UPLOADED" ]; then
  echo "Error: Upload failed (Cloudflare API and R2 S3 API both failed)" >&2
  echo "${RESPONSE:-<no Cloudflare API response>}" >&2
  exit 1
fi

echo "$PUBLIC_URL"

# Cleanup temp file
if [[ "$SOURCE" =~ ^https?:// ]]; then
  rm -f "$LOCAL_FILE"
fi
