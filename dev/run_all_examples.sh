#!/usr/bin/env bash

set -e
skip_items=("/node_modules/", "cli.mjs")

# Root directory
root_directory=$(pwd)

# Find all *.mjs files and run them with node
find . -type f -name '*.mjs' | while read -r file; do
    # Exclusions.
    skip=false
    for item in "${skip_items[@]}"; do
        if [[ $file == *"$item"* ]]; then
            skip=true
            break
        fi
    done
    if [ "$skip" = true ]; then
        continue
    fi

    echo -e "\n\n--------------------------------------------------------------\nRunning: $file"
    node "$file"
    echo -e "\nFinish: $file\n--------------------------------------------------------------\n"
done
