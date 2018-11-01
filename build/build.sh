#!/usr/bin/env bash

root="$(git rev-parse --show-toplevel)"
hash="$(git rev-parse HEAD)"

echo "Project root is $root"

if [ "$1" == "frontend" ]; then
  echo "Building frontend Docker image"
  docker build --tag "cityofedmonton/youcanbenefit-web:$hash" --file "$root/build/frontend.Dockerfile" "$root/frontend"
  echo "Image built successfully"
  echo "TagIs: cityofedmonton/youcanbenefit-web:$hash"
elif [ "$1" == "backend" ]; then
  echo "Building backend Docker image"
  docker build --tag "cityofedmonton/youcanbenefit-api:$hash" --file "$root/build/backend.Dockerfile" "$root/backend"
  echo "Image built successfully"
  echo "TagIs: cityofedmonton/youcanbenefit-api:$hash"
else
  echo "Invalid build type"
  exit -1
fi
