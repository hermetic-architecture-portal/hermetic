#!/usr/bin/env bash
export NODE_PATH=../lib
node_modules/@babel/node/bin/babel-node.js bin_src/sync.js "$@"