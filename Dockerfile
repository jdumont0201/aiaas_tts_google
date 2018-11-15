FROM node:10.13.0-alpine
RUN apk add --no-cache make gcc g++ python
RUN npm install --save @google-cloud/text-to-speech

RUN mkdir /ai && mkdir /ai/src && mkdir /ai/auth
ADD src/package.json /ai/src
RUN cd /ai/src && npm install
ADD src /ai/src
ADD auth.json /ai/auth
ENV GOOGLE_APPLICATION_CREDENTIALS "/ai/auth/auth.json"
RUN node -v

EXPOSE 3000


CMD ["node","/ai/src/server.js"]
