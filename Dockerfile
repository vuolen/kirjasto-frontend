FROM node:latest AS dev
WORKDIR /usr/src/app
ENV NODE_ENV="development"
COPY frontend frontend
COPY shared shared
WORKDIR /usr/src/app/frontend
RUN npm install --unsafe-perm
CMD npm run development

FROM dev as prod-build
ENV NODE_ENV="production"
RUN npm run build

FROM nginx:latest as prod
COPY --from=prod-build /usr/src/app/dist /usr/share/nginx/html
COPY --from=prod-build /usr/src/app/nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
