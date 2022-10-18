#!/bin/sh
npm install -g node-jq

PACKAGE_NAME=$(jq .name package.json)

PACKAGE_VERSION=$(jq .version package.json)
LATEST_PACKAGE_VERSION=$(npm show $PACKAGE_NAME version)

if [ $PACKAGE_VERSION != $LATEST_PACKAGE_VERSION ]  ; then
    yarn build
	yarn publish --new-version $PACKAGE_VERSION
else
    echo "Package not updated. Skipping publish" 
fi