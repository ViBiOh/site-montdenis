#!/bin/bash

set -e

function readVariableIfRequired() {
  if [ -z "${!1}" ]; then
    read -p "${1}=" $1
  else
    echo "${1}="${!1}
  fi
}

function docker-compose-hot-deploy() {
  PROJECT_NAME=${1}
  readVariableIfRequired "PROJECT_NAME"

  DOMAIN=${2}
  readVariableIfRequired "DOMAIN"

  SERVICE_NAME=${3}
  readVariableIfRequired "SERVICE_NAME"
  
  export DOMAIN=${DOMAIN}

  existingContainer=`docker-compose -p ${PROJECT_NAME} ps | grep ${SERVICE_NAME} | awk '{print $1}'`

  docker-compose -p ${PROJECT_NAME} pull
  docker-compose -p ${PROJECT_NAME} scale ${SERVICE_NAME}=2

  echo "Waiting 5 seconds to start..."
  sleep 5
  docker stop ${existingContainer}
  docker rm -f -v ${existingContainer}
  
  docker rmi `docker images --filter dangling=true -q 2>/dev/null` 2>/dev/null
}

export PATH=${PATH}:/opt/bin

PROJECT_NAME=${1}
readVariableIfRequired "PROJECT_NAME"

PROJECT_URL=${2}
readVariableIfRequired "PROJECT_URL"

rm -rf ${PROJECT_NAME}
git clone ${PROJECT_URL} ${PROJECT_NAME}
cd ${PROJECT_NAME}
docker-compose-hot-deploy ${PROJECT_NAME} ${3} ${4}

