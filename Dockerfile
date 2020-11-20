FROM node:lts
WORKDIR /usr/src/kirjasto-frontend

COPY . .

RUN npm install

ENTRYPOINT ["npm"]
