FROM node:18-alpine as build-stage
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.15
ADD dockerrun.sh /dockerrun.sh
WORKDIR /usr/share/nginx/html
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "/dockerrun.sh"]