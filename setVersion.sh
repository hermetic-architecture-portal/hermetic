#!/usr/bin/env bash
npm version $1 --no-git-tag-version
cd server
npm version $1 --no-git-tag-version
cd ../client
npm version $1 --no-git-tag-version
cd ../lib/hermetic-common
npm version $1 --no-git-tag-version