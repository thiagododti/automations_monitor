FROM nginx:1.25-alpine

COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ../nginx/cert/ /etc/nginx/certs/

COPY ../frontend/dist/ /usr/share/nginx/html/

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]