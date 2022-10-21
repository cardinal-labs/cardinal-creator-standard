#!/usr/bin/env bash

# This script generates the IDL JSONs without buildling the full packages.

rm -rf src/idl/
mkdir -p src/idl/

for PROGRAM in $(find ../program/ -maxdepth 3 -name lib.rs); do
    PROGRAM_NAME="cardinal_creator_standard"
    echo "Parsing IDL for $PROGRAM_NAME"
    anchor idl parse --file $PROGRAM --out-ts src/idl/$PROGRAM_NAME.ts || {
        echo "Could not parse IDL"
        exit 1
    }
done