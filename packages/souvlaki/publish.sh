#!/bin/bash

set -euxo pipefail

yarn test-once
yarn typecheck
yarn build
yarn npm publish
