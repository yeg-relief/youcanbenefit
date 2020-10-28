#!/usr/bin/env bash

root="$(git rev-parse --show-toplevel)"
#hash="$(git rev-parse HEAD)"
hash="$(date +%F)"
tag=hash
action="help"
echo "Project root is $root"
images=()

build_frontend() {
  echo "Building frontend Docker image"
  cd "$root/frontend"
  docker build --tag "cityofedmonton/ycb-frontend:$tag" .
  images+=("cityofedmonton/ycb-frontend:$tag")
  #docker tag "cityofedmonton/ycb-frontend:$hash" "cityofedmonton/ycb-frontend:$tag"
}

build_backend() {
  echo "Building backend Docker image"
  cd "$root/backend"
  docker build --tag "cityofedmonton/ycb-backend:$tag" .
  images+=("cityofedmonton/ycb-backend:$tag")
  #docker tag "cityofedmonton/ycb-backend:$hash" "cityofedmonton/ycb-backend:$tag"
}

print_help() {
  echo "Helps with build and pushing Docker images for You Can Benefit"
  echo " "
  echo "$package [options] application [arguments]"
  echo " "
  echo "options:"
  echo "-h, --help                show brief help"
  echo "frontend                  build the frontend image"
  echo "backend                   build the backend image"
  echo "-p, --push                also attempt to push the images. Must come after frontend and backend."
  echo "-t, --tag                 tag of image"
  exit 0
}

push_images(){
  docker push "cityofedmonton/ycb-frontend:$tag"
  docker push "cityofedmonton/ycb-backend:$tag"
  
}

while test $# -gt 0; do
  case "$1" in
  -h | --help)
    action="help"
    ;;

  frontend)
    action="build_frontend"
    shift
    ;;
  backend)
    action="build_backend"
    shift
    ;;
  -t | --tag)
    tag="$2"
    shift
    shift
    ;;
  push)
    action="push"
    shift
    ;;
  *)
    echo "Unknown option $1"
    break
    ;;
  esac
done

echo "$action $tag"

if [ "$action" == "build_frontend" ]; then
  build_frontend
elif [ "$action" == "build_backend" ]; then
  build_backend
elif [ "$action" = "push" ]; then
  push_images
else
  print_help
fi
