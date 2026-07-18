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

# Upload via Cloudflare API v4
echo "  → Uploading $FILENAME ..." >&2
RESPONSE=$(curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${FILENAME}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: ${MIME}" \
  --data-binary @"${LOCAL_FILE}")

if echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
  PUBLIC_URL="${R2_PUBLIC_URL}/${FILENAME}"
  echo "$PUBLIC_URL"
else
  echo "Error: Upload failed" >&2
  echo "$RESPONSE" >&2
  exit 1
fi

# Cleanup temp file
if [[ "$SOURCE" =~ ^https?:// ]]; then
  rm -f "$LOCAL_FILE"
fi
