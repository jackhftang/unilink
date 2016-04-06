#!/usr/bin/env bash

## compile
tsc --outDir build ./src/Link.ts -t 'ES6'

## test
mocha --compilers js:mocha-traceur
