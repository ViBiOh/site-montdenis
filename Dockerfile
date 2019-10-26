FROM node:13 as builder

WORKDIR /usr/src/app
COPY . .

RUN npm ci \
 && npm run build

FROM vibioh/viws:light

ARG APP_VERSION
ENV VERSION=${APP_VERSION}
COPY --from=builder /usr/src/app/dist/ /www/
