#!/usr/bin/env bash

## compile
tsc --outDir build --module commonjs ./src/Link.ts -t 'ES5'

## test
#mocha --compilers js:mocha-traceur
