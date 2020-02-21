FROM vibioh/viws:light

ENV VIWS_CSP "default-src 'self'; base-uri 'self'; script-src 'self' 'unsafe-inline' *.mapbox.com; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net/npm/normalize.css@8.0.0/ *.mapbox.com; img-src 'self' data: blob: ; child-src 'self' blob:; worker-src 'self' blob:; connect-src 'self' *.mapbox.com"
ENV VIWS_HEADERS "X-UA-Compatible:ie=edge~content-language:fr"

ARG VERSION
ENV VERSION=${VERSION}

COPY dist/ /www/
