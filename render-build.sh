#!/usr/bin/env bash
set -o errexit

echo "📦 Installing dependencies..."
npm install

echo "🛠 Building project..."
npm run build

echo "✅ Build finished!"
