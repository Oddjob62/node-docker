# Setup project

npm init -y
npm install express

# Test Run app locally

node index.js

# Docker node image
https://hub.docker.com/_/node

# Build docker image
docker build .

# Or with a name
docker build -t node-app-image .

# List Images
docker images ls
# Remove image (image ID)
docker image rm 3324

# Run image (detached, with name)
docker run -d --name node-app node-app-image

# Show running containers
docker ps

# Stop and remove container
docker rm node-app -f

# Run image (map port, detached, with name)
docker run -p 3000:3000 -d --name node-app node-app-image

# Connect to running container
docker exec -it node-app bash

# Run image (map folder, map port, detached, with name)
docker run -v pathtofolderonlocal:pathtofolderoncontainer -p 3000:3000 -d --name node-app node-app-image
docker run -v C:\Users\Alex\Desktop\NODE-DOCKER\:/app -p 3000:3000 -d --name node-app node-app-image

# for powershell...
docker run -v ${PWD}:/app -p 3000:3000 -d --name node-app node-app-image

# for cmd...
docker run -v %cd%:/app -p 3000:3000 -d --name node-app node-app-image 

# See Logs
docker logs <containername>
docker logs node-app

# Create more specific (aka anonymous) volume. This won't be synced with local folder
docker run -v ${PWD}:/app -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image

# Make bind folder read only (docker cannot write back to host)
docker run -v ${PWD}:/app:ro -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image

# set environmental variable
docker run -v ${PWD}:/app -v /app/node_modules --env PORT=3001 -p 3000:3001 -d --name node-app node-app-image
# or with a file
docker run -v ${PWD}:/app -v /app/node_modules --env-file ./.env -p 3000:3001 -d --name node-app node-app-image

# install nodemon (so it reloads when code changes)
# adds to node_modules
npm install nodemon --save-dev

# in package.json
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js" 
  },

# list volumes (shows volumes from deleted containers)
docker volume ls

# delete all old volumes
docker volume prune

# deletes volume when deleting container
docker rm node-app -fv

# bring up docker compose (disconnected)
docker compose up -d

# bring up docker compose (disconnected, rebuild container images)
docker compose up -d --build

# take down docker compose (delete anon volumes)
docker compose down -v 

# bring up docker compose with extra override file
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d


# Docker Mongo image
https://hub.docker.com/_/mongo

# Testing inside mongo container
mongo -u "root" -p "example"
# List databases
db
use mydb
db.books.insert({"name":"Harry Potter"})
db.books.find()
show dbs

# go straight into mongo
docker exec -it node-docker_mongo_1 mongo -u "root" -p "example"

# named volume
        volumes:
            - mongo-db:/data/db

# find ip of container
docker inspect node-docker_mongo_1

# show container logs
docker logs node-docker_node-app_1

# show all docker networks and get details
docker network ls
docker network inspect <network_name>

# run just specific container with (ignore dependencies in docker-compose)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --no-deps node-app

# use bcryptjs to has password
npm install bcryptjs

# Install requirements for Redis
npm install redis connect-redis express-session

# -V renew anonyomous volumes
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d -V --build

# looking inside redis
docker exec -it node-docker_redis_1 redis-cli

127.0.0.1:6379> keys *
1) "sess:qC_51e8p1XHlvkw0YIrtl5r_eUanGZm2"
127.0.0.1:6379> get "sess:qC_51e8p1XHlvkw0YIrtl5r_eUanGZm2"
"{\"cookie\":{\"originalMaxAge\":30000,\"expires\":\"2021-05-05T21:56:06.658Z\",\"secure\":false,\"httpOnly\":false,\"path\":\"/\"}}"

# Manually find annd delete stuff in Mongo
db.users.find()
db.users.deleteOne({ "_id" : ObjectId("60931954bd28cc00b60674f1"), "username" : "alex1", "password" : "$2a$12$NR.ZG/u2Hhf4YJaFGelnuOfCNq32BVl84O2/wnhsLmmkYbG4ps4Gm", "__v" : 0 })

db.posts.find()

# Expres behind proxy
https://expressjs.com/en/guide/behind-proxies.html


# ** Workflow **
  # Make changes
  # Build image
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml build node-app
  # Push image to docker hub
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml push node-app
  # On production server pull new image
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml pull node-app
  # bring up (only) new image
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --no-deps node-app
