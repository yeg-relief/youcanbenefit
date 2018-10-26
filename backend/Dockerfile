FROM node:9.8.0

COPY . /usr/api-server
WORKDIR /usr/api-server

RUN npm install
RUN npm install pm2 -g
RUN npm run prestart:prod

# if this folder doesn't exist nodejs won't start:
RUN mkdir -p /usr/api-server/dist/src/modules/log/logs

# These folders are needed for the /api/notification endpoint
RUN mkdir -p /usr/api-server/dist/src/modules/log/logs/youcanbenefit
RUN mkdir -p /usr/api-server/dist/src/modules/log/logs/youcanbenefit/form_submission
RUN mkdir -p /usr/api-server/dist/src/modules/log/logs/youcanbenefit/form_results


EXPOSE 3000

CMD ["pm2-runtime", "dist/src/server.js", "--name", "api-server"]
