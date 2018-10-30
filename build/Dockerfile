FROM node:9.8.0
RUN apt-get install git

ARG CACHEBUST=1
ARG BRANCH
RUN git clone --branch $BRANCH --single-branch --depth=1 https://github.com/yeg-relief/api-server /usr/api-server

WORKDIR /usr/api-server
RUN npm install
RUN npm install pm2 -g

EXPOSE 3000

RUN npm run prestart:prod

CMD ["pm2-runtime", "dist/src/server.js", "--name", "api-server"]