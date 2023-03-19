#!/usr/bin/env bash

set -euo pipefail

FILES="manifest.json *.js COPYING NOTICE icon"

zip -r storm-access.zip $FILES

sed -i 's/"manifest_version": 2,/"manifest_version": 3,/' manifest.json
zip -r storm-access-chrome.zip $FILES
sed -i 's/"manifest_version": 3,/"manifest_version": 2,/' manifest.json

