FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm update

RUN npm i -g serve

RUN apk update && apk add bash

COPY . .

RUN npm run build

EXPOSE 3000

EXPOSE 8080

CMD [ "serve", "-s", "dist" ]