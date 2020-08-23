set -x
set -e

DEBUG=* VERSION=2 yarn build

# export NODE_OPTIONS="--stack-trace-limit=40"

# rm -rf dist
# yarn build
# yarn fab:build
# yarn fab:serve