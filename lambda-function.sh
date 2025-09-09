#!/bin/bash
set -e

echo "🚀 Cleaning old builds..."
rm -rf dist lambda-function function.zip

echo "📦 Installing full dependencies (with devDependencies)..."
npm install

echo "🛠️ Building TypeScript..."
npm run build

echo "📂 Preparing Lambda package folder..."
mkdir -p lambda-function
cp -r dist/* lambda-function/
cp package.json lambda-function/

echo "📦 Installing production dependencies only..."
cd lambda-function
npm install --only=production --no-package-lock

echo "🗜️ Creating deployment zip..."
zip -r ../function.zip .

cd ..