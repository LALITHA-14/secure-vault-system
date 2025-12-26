FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN chmod +x /app/docker/entrypoint.sh
