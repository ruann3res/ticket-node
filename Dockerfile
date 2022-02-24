FROM node:alpine

WORKDIR /urs/app

COPY package*.json ./

RUN yarn

RUN yarn add global nodemon
RUN yarn add global bcrypt

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]