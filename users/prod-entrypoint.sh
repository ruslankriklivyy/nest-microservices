#!/bin/sh
set -e

npm run typeorm:migration:run
npm run seed:run:all

node dist/main.js
