FROM node:11 as builder

WORKDIR /usr/src/app
COPY . .

RUN npm ci \
 && npm run build

FROM vibioh/viws

ARG APP_VERSION
ENV VERSION=${APP_VERSION}
COPY --from=builder /usr/src/app/dist/ /www/
