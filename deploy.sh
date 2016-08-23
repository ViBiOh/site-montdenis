#!/bin/sh

export DOMAIN=pension-montdenis.fr
export PROJECT_NAME=montdenis

docker-compose -p ${PROJECT_NAME} pull
docker-compose -p ${PROJECT_NAME} up -d --force-recreate

docker rmi `docker images --filter dangling=true -q 2>/dev/null` 2>/dev/null

