FROM node:lts-alpine
WORKDIR /usr/src/kirjasto-frontend

COPY . .

RUN npm ci
RUN npm install

ENTRYPOINT ["npm"]
