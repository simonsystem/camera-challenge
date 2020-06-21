FROM node:10-alpine

COPY . /app

WORKDIR /app

RUN ["/bin/sh", "-c", "yarn install && yarn test && yarn build"]

CMD ["yarn", "start"]
