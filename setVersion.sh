#!/usr/bin/env bash
npm version $1 --no-git-tag-version
cd server
npm version $1 --no-git-tag-version
cd ../client
npm version $1 --no-git-tag-version
cd ../lib/hermetic-client-plugin
npm version $1 --no-git-tag-version
cd ../hermetic-server-plugin
npm version $1 --no-git-tag-version
cd ../hermetic-edit-server-plugin
npm version $1 --no-git-tag-version
cd ../hermetic-edit-client-plugin
npm version $1 --no-git-tag-version
cd ../hermetic-common
npm version $1 --no-git-tag-version