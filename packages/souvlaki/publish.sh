#!/bin/bash

yarn jest --env jsdom
yarn build
yarn publish
