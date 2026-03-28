# ---------- BUILD DO FRONTEND ----------
# O processo de build do frontend é feito em uma etapa separada para otimizar a construção da imagem final do Nginx.
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./

RUN npm ci --prefer-offline --no-audit

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