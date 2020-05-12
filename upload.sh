# set -x
set -e

rm -rf ./dist/

yarn build

# So much hack!
# TODO: Implement a way to get webpack stats during build. Currently building twice and copying.
cp ./dist/node/loadable-stats.json ./src/

rm -rf ./dist/

yarn build

# cd ./dist/browser
for f in $(find ./dist/browser/ -name '*.*'); do
  key="static${f/\.\/dist\/browser\//}"
  echo "Uploading $key"
  yarn wrangler kv:key put --binding=BASIC_WEBPACK "$key" $f --path
done

for f in $(find ./dist/document/ -name '*.*'); do
  key="document${f/\.\/dist\/document\//}"
  echo "Uploading $key"
  yarn wrangler kv:key put --binding=BASIC_WEBPACK "$key" $f --path
done

echo "Publish Worker"
yarn wrangler publish
