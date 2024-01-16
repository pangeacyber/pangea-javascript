#!/usr/bin/env bash

PACKAGE_NAME="$1"

PACKAGE_VERSION=$(npm list --depth=0 --json | jq .dependencies.$PACKAGE_NAME.version | tr -d '"')
echo "Current package version: $PACKAGE_VERSION"

LATEST_PACKAGE_VERSION=$(npm show $PACKAGE_NAME version)
echo "Published packaged version $LATEST_PACKAGE_VERSION"

if [ "$PACKAGE_VERSION" != "$LATEST_PACKAGE_VERSION" ] ; then
    echo "Package installed for $PACKAGE_NAME ($PACKAGE_VERSION) does not match latest package $LATEST_PACKAGE_VERSION"
    exit 1
else
    echo "Package not updated. Skipping publish"
fi
