FROM node:latest AS dev
WORKDIR /usr/src/app/frontend
ENV NODE_ENV="development"
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
CMD npm run development

FROM dev as prod-build
ENV NODE_ENV="production"
RUN npm run build

FROM nginx:latest as prod
COPY --from=prod-build /usr/src/app/dist /usr/share/nginx/html
COPY --from=prod-build /usr/src/app/nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
