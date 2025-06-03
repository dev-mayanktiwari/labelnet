#!/bin/bash

set -e 
echo "Checking server for changes..."

# Fixed: No spaces around = in bash variable assignment
AFFECTED_OUTPUT=$(pnpm turbo run build --affected --dry-run)

echo "Affected output:"
echo "$AFFECTED_OUTPUT"

if echo "$AFFECTED_OUTPUT" | grep -q "server#build"; then
  echo "Server affected"
  echo "server_affected=true" >> $GITHUB_OUTPUT
else
  echo "Server not affected"
  echo "server_affected=false" >> $GITHUB_OUTPUT
fi