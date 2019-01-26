#!/usr/bin/env bash

root="$(git rev-parse --show-toplevel)"
hash="$(git rev-parse HEAD)"
echo "Project root is $root"
images=()

while test $# -gt 0; do
  case "$1" in
    -h|--help)
      echo "Helps with build and pushing Docker images for You Can Benefit"
      echo " "
      echo "$package [options] application [arguments]"
      echo " "
      echo "options:"
      echo "-h, --help                show brief help"
      echo "frontend                  build the frontend image"
      echo "backend                   build the backend image"
      echo "-p, --push                also attempt to push the images. Must come after frontend and backend."
      exit 0
      ;;
    frontend)
      echo "Building frontend Docker image"
      cd "$root/frontend"
      docker build --tag "cityofedmonton/youcanbenefit-web:$hash" .
      images+=("cityofedmonton/youcanbenefit-web:$hash")
      shift
      ;;
    backend)
      echo "Building backend Docker image"
      cd "$root/backend"
      docker build --tag "cityofedmonton/youcanbenefit-api:$hash" .
      images+=("cityofedmonton/youcanbenefit-api:$hash")
      shift
      ;;
    -p|--push)
      for image in "${images[@]}"
      do
        echo "Pushing $image"
        docker push "$image"
      done
      shift
      ;;
    *)
      echo "Unknown option $1"
      break
      ;;
  esac
done