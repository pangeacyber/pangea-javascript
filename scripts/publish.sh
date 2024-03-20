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
    echo yarn build

    if [[ "$PACKAGE_VERSION" == *"beta"* ]] ; then
	      echo yarn publish --new-version "$PACKAGE_VERSION" --tag beta
    else
        echo yarn publish --new-version "$PACKAGE_VERSION"
    fi
else
    echo "Package not updated. Skipping publish"
fi
