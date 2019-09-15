FROM node:12.2.0-alpine
LABEL description="render-server"

WORKDIR /code/dist

COPY ./dist /code/dist

EXPOSE 3001

CMD node /code/dist/server.js