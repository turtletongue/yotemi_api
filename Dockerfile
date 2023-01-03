FROM node:18.12.1-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3030

CMD ["yarn", "start:dev"]