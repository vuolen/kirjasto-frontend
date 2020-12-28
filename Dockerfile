FROM node:latest AS base
WORKDIR /usr/src/app
COPY . .

FROM base as prod-build
ENV NODE_DEV=production
RUN npm install
RUN npm run build

FROM nginx:latest as prod
COPY --from=prod-build /usr/src/app/dist /usr/share/nginx/html
COPY --from=prod-build /usr/src/app/nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80

FROM base as dev
CMD npm run wait development
