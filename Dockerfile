FROM node:latest
WORKDIR /usr/src/kirjasto-frontend

COPY . .

RUN npm install

