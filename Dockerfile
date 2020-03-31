FROM node:10-alpine

RUN apk add git

# required by node-gyp
RUN apk add --virtual .gyp --no-cache python make g++

RUN addgroup -S -g 222 hermetic && adduser -S -D -u 222 hermetic -G hermetic

WORKDIR /app

COPY --chown=hermetic:hermetic ./package.json /app/
COPY --chown=hermetic:hermetic ./lib /app/lib
COPY --chown=hermetic:hermetic ./client /app/client
COPY --chown=hermetic:hermetic ./server /app/server
COPY --chown=hermetic:hermetic ./sample-data /app/sample-data

RUN npm set unsafe-perm true
RUN npm install 
RUN npm run build

RUN apk del .gyp

EXPOSE 3001

USER hermetic

# need to rebuild only if one of the below env variables are set
CMD if [[ "${HERMETIC_CUSTOM_SASS_PATH}${REACT_APP_HERMETIC_DEFAULT_PATH}" != "" ]]; then npm run build; fi && npm start
