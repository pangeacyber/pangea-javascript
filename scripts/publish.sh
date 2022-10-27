#!/bin/sh
PACKAGE_NAME=$(jq .name package.json)
echo "Looking to update: $PACKAGE_NAME"
if [ $PACKAGE_NAME = "" ] ; then
    exit 1
fi

PACKAGE_VERSION=$(jq .version package.json)
echo "Current package version: $PACKAGE_VERSION"

LATEST_PACKAGE_VERSION=$(npm show $PACKAGE_NAME version)
echo "Published packaged version $LATEST_PACKAGE_VERSION"

if [ $PACKAGE_VERSION != $LATEST_PACKAGE_VERSION ] ; then
    yarn build
	yarn publish --new-version $PACKAGE_VERSION
else
    echo "Package not updated. Skipping publish" 
fi