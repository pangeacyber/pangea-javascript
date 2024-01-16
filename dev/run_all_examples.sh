#!/bin/bash

# Root directory
root_directory=$(pwd)

yarn install

# Find all *.mjs files and run them with node
find . -type f -name '*.mjs' | while read -r file; do
    echo -e "\n\n--------------------------------------------------------------\nRunning: $file"
    node "$file"
    echo -e "\nFinish: $file\n--------------------------------------------------------------\n"
done
