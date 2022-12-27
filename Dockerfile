FROM node:16 AS builder

ARG DATABASE_URL=${DATABASE_URL}
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app

COPY package.json yarn.lock ./
RUN apt install make gcc g++ python
RUN yarn install
COPY . .
RUN yarn prisma generate
RUN yarn prisma migrate deploy
RUN yarn build

FROM node:16
WORKDIR /app
RUN apt install make gcc g++ python
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env

EXPOSE 4000

CMD [ "yarn", "start:prod" ]