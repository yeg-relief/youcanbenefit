#!/bin/bash
export NODE_ENV=INTEGRATION_TEST

DOCKER_NAME=ycbIntegrationES
SLEEP_TIME=30

docker run --name $DOCKER_NAME -p 9400:9200 -p 9500:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.1.0 &

echo "sleeping for 30 seconds"
sleep $SLEEP_TIME

ID=$(docker inspect --format="{{.Id}}" $DOCKER_NAME)

ts-node seed/run.ts

sleep $SLEEP_TIME

if [ "$1" == "u" ]; then
    npm run integration-test-update
else
    npm run integration-test
fi


docker kill $ID
docker rm $DOCKER_NAME
