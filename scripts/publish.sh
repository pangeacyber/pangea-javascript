#!/usr/bin/env bash

set -e

PACKAGE_NAME=$(jq .name package.json | tr -d '"')
echo "Looking to update: $PACKAGE_NAME"
if [ "$PACKAGE_NAME" = "" ] ; then
    exit 1
fi

PACKAGE_VERSION=$(jq .version package.json | tr -d '"')
echo "Current package version: $PACKAGE_VERSION"

LATEST_PACKAGE_VERSION=$(npm show "$PACKAGE_NAME" version)
echo "Published packaged version $LATEST_PACKAGE_VERSION"

if [ "$PACKAGE_VERSION" != "$LATEST_PACKAGE_VERSION" ] ; then
    yarn build

    # yarn v4 uses `yarn npm publish`.
    # yarn v1 uses `yarn publish`.
    YARN_VERSION=$(yarn --version)
    YARN_MAJOR_VERSION=$(echo "$YARN_VERSION" | cut -d. -f1)
    if [ "$YARN_MAJOR_VERSION" -ge 4 ]; then
        if [[ "$PACKAGE_VERSION" == *"beta"* ]] ; then
            yarn npm publish --tag beta
        else
            yarn npm publish
        fi
    else
        if [[ "$PACKAGE_VERSION" == *"beta"* ]] ; then
            yarn publish --new-version "$PACKAGE_VERSION" --tag beta
        else
            yarn publish --new-version "$PACKAGE_VERSION"
        fi
    fi
else
    echo "Package not updated. Skipping publish"
fi
