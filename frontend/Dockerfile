FROM node:10.11.0 AS builder

COPY . /usr/app
WORKDIR /usr/app

RUN npm install
RUN npm run build


FROM nginx:1.15.3
COPY --from=builder /usr/app/dist /usr/app
COPY --from=builder /usr/app/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/app