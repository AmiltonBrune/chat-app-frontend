FROM node:18.5.0 As development

WORKDIR /usr/src/app/user

COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma

RUN yarn install
RUN yarn prisma generate

COPY . .

RUN yarn build

FROM node:18.5.0 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app/user

COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma

RUN yarn install
RUN yarn prisma generate

COPY . .

COPY --from=development /usr/src/app/user/dist ./dist

CMD ["yarn", "prisma", "migrate", "deploy", "&&", "node", "dist/main.js"]
