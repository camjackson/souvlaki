#!/bin/bash

set -euxo pipefail

yarn test-once
yarn build
yarn npm publish
