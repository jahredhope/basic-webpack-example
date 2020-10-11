# set -x
set -e

# Incremement Dev Version
OLD_VERSION="$(cat dev-version.txt)" || OLD_VERSION="0"
export VERSION=$(($OLD_VERSION + 1))
echo "$VERSION" > dev-version.txt

echo "Deploying Version: $VERSION"

rm -rf ./dist/

yarn build

# wrangler requires the main attribuet of package json to be set to the file path
sed -i '' 's+"wrangler_main": "dist/cloudflare/response.js",+"main": "dist/cloudflare/response.js",+g' package.json

for f in $(find ./dist/browser/ -name '*.*'); do
  key="static${f/\.\/dist\/browser\//}"
  echo "Uploading $key"
  yarn wrangler kv:key put --binding=BASIC_WEBPACK "$key" $f --path
done

for f in $(find ./dist/document/ -name '*.*'); do
  key="document/$VERSION${f/\.\/dist\/document\//}"
  echo "Uploading $key"
  yarn wrangler kv:key put --binding=BASIC_WEBPACK "$key" $f --path
done

echo "Publish Worker"
yarn wrangler publish

sed -i '' 's+"main": "dist/cloudflare/response.js",+"wrangler_main": "dist/cloudflare/response.js",+g' package.json

echo "Successfully deployed version: $VERSION"

echo "Starting tail"
./node_modules/.bin/wrangler tail > prod.log