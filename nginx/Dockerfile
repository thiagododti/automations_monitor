FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /etc/nginx/certs

COPY ./cert/* /etc/nginx/certs