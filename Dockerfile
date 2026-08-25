
# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.23.2

FROM node:${NODE_VERSION}-alpine


WORKDIR /src/app

# Copiar package files primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar proyecto
COPY . .

# Crear directorio de caché y darle permisos al usuario node
RUN mkdir -p .angular/cache \
    && chown -R node:node /src/app

# Exponer puerto
EXPOSE 11001

# Usuario no root
USER node

# Comando inicio
CMD ["npm", "run", "start"]
