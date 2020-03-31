#!/bin/sh
export NODE_PATH=../lib
node_modules/@babel/node/bin/babel-node.js bin_src/validate.js "$@"