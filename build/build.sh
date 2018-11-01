#!/usr/bin/env bash

root="$(git rev-parse --show-toplevel)"
hash="$(git rev-parse HEAD)"

echo "Project root is $root"

if [ "$1" == "frontend" ]; then
  echo "Building frontend Docker image"
  docker build --tag "cityofedmonton/youcanbenefit-web:$hash" --file "$root/build/frontend.Dockerfile" "$root/frontend"
elif [ "$1" == "backend" ]; then
  echo "Building backend Docker image"
else
  echo "Invalid build type"
fi
