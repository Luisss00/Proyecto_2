-- Crear usuario y base de datos
CREATE USER fashion_user WITH PASSWORD 'fashion_pass_2024';
CREATE DATABASE fashion_store WITH OWNER fashion_user ENCODING 'UTF8';
GRANT ALL PRIVILEGES ON DATABASE fashion_store TO fashion_user;

-- Conectar a la base de datos
\c fashion_store

-- Otorgar permisos
GRANT ALL ON SCHEMA public TO fashion_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fashion_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fashion_user;

-- Configuración regional
SET timezone = 'America/Bogota';