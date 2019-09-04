FROM node:8.16.1-alpine
WORKDIR /app

COPY ./package.json /app/
COPY ./lib /app/lib
COPY ./client /app/client
COPY ./server /app/server
COPY ./sample-data /app/sample-data

RUN npm set unsafe-perm true
RUN npm install

EXPOSE 3001

CMD npm run build && npm start