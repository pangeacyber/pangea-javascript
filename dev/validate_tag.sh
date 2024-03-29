#!/usr/bin/env bash

set -e

if [ $# -lt 1 ]; then
    echo "usage: validate_tag.sh <git_tag>"
    exit 1
fi

GIT_TAG=$1

if [[ ! $GIT_TAG == *"/"* ]]; then
   echo "Git tag must contain a forward slash to delimit the package name from the version number."
   exit 1
fi

PACKAGE_NAME=$(echo "$GIT_TAG" | cut -d "/" -f 1)
VERSION=$(echo "$GIT_TAG" | cut -d "/" -f 2)

if [[ ! "$VERSION" == *"v"* ]]; then
   echo "Git tag must contain a version number that's prefixed with 'v'."
   exit 1
fi

# Move to repo root.
PARENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)
pushd "$PARENT_PATH/.."

PACKAGEJSON_VERSION=v$(npm view packages/pangea-node-sdk/ version)

if [[ ! "$VERSION" == "$PACKAGEJSON_VERSION" ]]; then
   echo "Git tag version '$VERSION' does not match package.json version '$PACKAGEJSON_VERSION'."
   exit 1
fi

popd
