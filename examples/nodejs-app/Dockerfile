ARG NODE_VERSION=12.10

FROM node:$NODE_VERSION

RUN mkdir -p /opt/app

ENV TERM=xterm APP=/opt/app


ARG NODE_ENV=production

ENV npm_config_tmp=/tmp NODE_PATH=$NODE/src NODE_ENV=$NODE_ENV

WORKDIR $APP

ADD package.json package-lock.json $APP/

RUN npm install

ADD . $APP

CMD node -r ./tracing.js app.js
