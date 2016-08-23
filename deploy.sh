#!/bin/bash

set -e

function readVariableIfRequired() {
  if [ -z "${!1}" ]; then
    read -p "${1}=" $1
  else
    echo "${1}="${!1}
  fi
}

if [ ${#} -eq 0 ]; then
  echo Usage ${0} [DOMAIN] [PROJECT_NAME]
fi

DOMAIN=${1}
readVariableIfRequired "DOMAIN"

PROJECT_NAME=${2}
readVariableIfRequired "PROJECT_NAME"

docker-compose -p ${PROJECT_NAME} pull
docker-compose -p ${PROJECT_NAME} up -d --force-recreate

docker rmi `docker images --filter dangling=true -q 2>/dev/null` 2>/dev/null
