# set -x
set -e

# cd ./dist/browser
for f in ./dist/browser/*; do
  key="${f/\.\/dist\/browser\//}"
  echo "Uploading $key"
  yarn wrangler kv:key put --binding=BASIC_WEBPACK "$key" $f --path
done

echo "Publish Worker"
yarn wrangler publish
