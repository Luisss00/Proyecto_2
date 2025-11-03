# Etapa 1: Construcción
FROM node:18-alpine AS build

WORKDIR /app

# Copiamos los archivos de configuración
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Compilamos la aplicación para producción
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# Copiamos los archivos compilados al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html


# Exponemos el puerto 80
EXPOSE 80

# Iniciamos Nginx
CMD ["nginx", "-g", "daemon off;"]
