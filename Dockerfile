FROM node:lts-alpine
WORKDIR /usr/src/kirjasto-frontend

COPY . .

RUN npm install

ENTRYPOINT ["npm"]
