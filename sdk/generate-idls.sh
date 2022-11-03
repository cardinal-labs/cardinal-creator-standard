#!/usr/bin/env bash

# This script generates the IDL JSONs without buildling the full packages.

rm -rf sdk/src/idl
mkdir -p sdk/src/idl

for PROGRAM in $(find ../program/ -maxdepth 3 -name lib.rs); do
    PROGRAM_NAME="cardinal_creator_standard"
    echo "Parsing IDL for $PROGRAM_NAME"
    anchor idl parse --file $PROGRAM --out-ts sdk/src/idl/$PROGRAM_NAME.ts || {
        echo "Could not parse IDL"
        exit 1
    }
done
