#!/bin/bash

set -e

# Waits for a docker container to be ready on a given port
# Argument # is port
waitFor ()
{
    HEALTHY=false
    while [[ $HEALTHY != true ]]; do
      sleep 2
      RES_YELLOW=$(curl -s localhost:$1/_cluster/health | sed -n 's/.*\(yellow*\).*/\1/p')
      RES_GREEN=$(curl -s localhost:$1/_cluster/health | sed -n 's/.*\(green*\).*/\1/p')
      
      if [ "$RES_YELLOW" == "yellow" ] || [ "$RES_GREEN" == "green" ] ; then
        echo "Health is " $RES_YELLOW $RES_GREEN
        HEALTHY=true
      fi
    done
}

export NODE_ENV=INTEGRATION_TEST
DOCKER_NAME=ycbIntegrationES
ES_PORT_1=9400
ES_PORT_2=9500

docker run --name $DOCKER_NAME -p $ES_PORT_1:9200 -p $ES_PORT_2:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.1.0 &

echo "Waiting for container to start..."
waitFor $ES_PORT_1

ID=$(docker inspect --format="{{.Id}}" $DOCKER_NAME)
echo "Container is " $ID

echo "Waiting for Elasticsearch to seed..."
npx ts-node seed/run.ts
sleep 10

CHECK=$1
if [ ! -z ${CHECK} ] && [ "$1" == "u" ]; then
    npm run integration-test-update
else
    npm run integration-test
fi

echo "Attempting to kill Elasticsearch"
docker kill $ID
docker rm $DOCKER_NAME

