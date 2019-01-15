#!/bin/bash

# Waits for a docker container to be ready on a given port
# Argument #1 is container name
# Argument #2 is port
waitFor ()
{
    until [ "`docker inspect -f {{.State.Status}} $1`"=="running" ]; do
        sleep 0.1;
    done;
    echo "$1 is alive, waiting for ES to be available."
    docker inspect --format 'localhost:'$2 $1 | xargs wget --retry-connrefused --tries=15 --wait=3 --spider
    echo "Elasticsearch is listening for connections"
    sleep 3
}

export NODE_ENV=INTEGRATION_TEST

DOCKER_NAME=ycbIntegrationES
ES_PORT_1=9400
ES_PORT_2=9500

docker run --name $DOCKER_NAME -p $ES_PORT_1:9200 -p $ES_PORT_2:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.1.0 &

echo "Waiting for container to start..."
waitFor $DOCKER_NAME $ES_PORT_1

ID=$(docker inspect --format="{{.Id}}" $DOCKER_NAME)

echo "Waiting for Elasticsearch to seed..."
npx ts-node seed/run.ts
sleep 10

CHECK=$1
if [ ! -z ${CHECK} ] && [ "$1" == "u" ]; then
    npm run integration-test-update
else
    npm run integration-test
fi


docker kill $ID
docker rm $DOCKER_NAME

