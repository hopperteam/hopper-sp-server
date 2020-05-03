FROM node:12 AS builder

EXPOSE 80
COPY src /app/src
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY tsconfig.json /app/tsconfig.json
WORKDIR /app
RUN yarn 
RUN npm run-script build

FROM node:12-alpine AS runner
EXPOSE 80
COPY --from=builder /app/.build /app/.build
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/yarn.lock /app/yarn.lock
WORKDIR /app
RUN yarn install --production
ENTRYPOINT ["node", "."]
