FROM node:11 as builder

WORKDIR /usr/src/app
COPY . .

RUN npm ci \
 && npm run build \
 && mkdir -p /app \
 && cp -r dist/ /app/

FROM vibioh/viws

ARG VERSION
ENV VERSION=${VERSION}
COPY --from=builder /app/dist/ /www/
