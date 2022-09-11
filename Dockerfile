FROM node:14.20-alpine3.15
RUN apk add g++ make
RUN apk add python2 --repository http://nl.alpinelinux.org/alpine/v3.5/main --allow-untrusted
MAINTAINER daniel@lightfeather.io
EXPOSE 8080
WORKDIR /home/node
COPY package.json .
RUN npm install
COPY angular.json .
COPY src ./src
COPY tsconfig.* .
RUN npm run-script ng build
COPY index.js .
ENTRYPOINT ["node", "index.js"]