#! /usr/bin/env bash

# abort on nonzero exitstatus
set -o errexit
# abort on unbound variable
set -o nounset
# don't hide errors within pipes
set -o pipefail

PACKAGES_URL="${PACKAGES_HOST}${OBJECT_PATH}"
OBJECT_PATH_COMPRESSED="${STORAGE_BUCKET}${OBJECT_PATH}.xz"

TEMP_FILE=$(mktemp)
TEMP_FILE_COMPRESSED="${TEMP_FILE}.xz"

curl --output "${TEMP_FILE}" "${PACKAGES_URL}"
xz --compress --extreme --verbose ${TEMP_FILE}
gcloud storage cp --cache-control "public,max-age=3600" --content-type "application/x-xz" "${TEMP_FILE_COMPRESSED}" "${OBJECT_PATH_COMPRESSED}"

rm ${TEMP_FILE_COMPRESSED}
