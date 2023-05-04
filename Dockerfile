FROM node:lts as Build

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

FROM nginx:stable-alpine

COPY --from=Build /app/dist /var/www/dist
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]