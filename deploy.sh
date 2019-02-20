#!/usr/bin/env bash

PROJECT=UniY3-Project

cd ./projects
ls
if [ ! -d "$PROJECT" ]; then
	git clone "https://github.com/elliotleelewis/$PROJECT.git"
fi
cd $PROJECT
git pull
docker-compose build
docker-compose down
docker-compose up -d
