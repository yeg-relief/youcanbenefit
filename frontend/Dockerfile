FROM node:10.11.0 AS builder

COPY . /usr/app
WORKDIR /usr/app

RUN npm install
RUN npm run build

FROM abiosoft/caddy:0.11.2
COPY --from=builder /usr/app/dist/frontend /srv
COPY --from=builder /usr/app/Caddyfile /etc/Caddyfile

RUN echo "webuser:x:10000:" >> /etc/group
RUN echo "webuser:x:4992:10000:webuser:/:/sbin/nologin" >> /etc/passwd
RUN chown -R webuser:webuser /srv
RUN chmod 644 /etc/Caddyfile
RUN chmod 777 /
RUN mkdir -p /.caddy
RUN chown -R webuser:webuser /.caddy

USER webuser


ENV API_SERVICE=localhost
ENV API_PORT=3000
ENV ADMIN_USERNAME=user
ENV ADMIN_PASSWORD=password

EXPOSE 8080
EXPOSE 8443
WORKDIR /srv
