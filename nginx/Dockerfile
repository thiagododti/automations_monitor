# ---------- BUILD DO FRONTEND ----------
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npm run build
# ---------- NGINX ----------

FROM nginx:1.25-alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/cert/ /etc/nginx/certs/

# Copy vindo do build feito pelo Dockerfile
COPY --from=frontend-builder frontend/dist /usr/share/nginx/html

# Copy vindo diretamente do build feito pelo usuario
# COPY frontend/dist/ /usr/share/nginx/html/

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]