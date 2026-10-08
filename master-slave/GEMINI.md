# Master-Slave System Rules

## Docker & Node.js Volume Permissions (Linux Hosts)
Para evitar errores de permisos (`EACCES`) y bloqueos de sistema de archivos (`EBUSY`) al montar volúmenes locales en contenedores Docker:
1. **Dockerfiles**:
   - Ejecuta comandos de configuración global como root primero (ej. `RUN corepack enable pnpm`).
   - Obligatoriamente cambia al usuario sin privilegios ANTES de instalar dependencias o correr el código: `USER node`.
2. **Docker Compose**:
   - Aísla la carpeta de dependencias del contenedor de la del host usando volúmenes anónimos nombrados: `- backend_node_modules:/app/node_modules`
   - **NUNCA** montes volúmenes nombrados sobre directorios que el framework necesita borrar/recrear durante el hot-reload (ej. la carpeta `dist/` de NestJS), ya que Linux bloqueará la operación con `EBUSY`.

## TypeORM Database Driver
- El sistema utiliza **PostgreSQL** (`type: 'postgres'`) en lugar de SQLite. Asegúrate de instalar el paquete `pg` y de apuntar al contenedor `ms-postgres` configurado en el `docker-compose.yml`.
