FROM node:10.11.0 AS builder

COPY . /usr/app
WORKDIR /usr/app

RUN npm install
RUN npm run build

FROM abiosoft/caddy:0.11.2
COPY --from=builder /usr/app/dist/frontend /srv
COPY --from=builder /usr/app/Caddyfile /etc/Caddyfile

ENV API_SERVICE=localhost
ENV API_PORT=3000
ENV ADMIN_USERNAME=user
ENV ADMIN_PASSWORD=password

EXPOSE 80
WORKDIR /srv