FROM node:10 as builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY . ./

RUN npm install

#COPY . .

COPY --chown=node:node . .

USER node

EXPOSE 4000

CMD ["node",  "server.js"]
