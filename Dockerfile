FROM node:10-alpine

COPY . /app

WORKDIR /app

RUN ["/bin/sh", "-e", "-c", "yarn install && yarn build"]

CMD ["yarn", "start"]
