# Master-Slave System Rules

## Docker & Node.js Volume Permissions (Linux Hosts)
Para evitar errores de permisos (`EACCES`) y bloqueos de sistema de archivos (`EBUSY`) al montar volúmenes locales en contenedores Docker:
1. **Dockerfiles**:
   - Ejecuta comandos de configuración global como root primero (ej. `RUN corepack enable pnpm`).
   - Obligatoriamente cambia al usuario sin privilegios ANTES de instalar dependencias o correr el código: `USER node`.
2. **Docker Compose**:
   - Aísla la carpeta de dependencias del contenedor de la del host usando volúmenes anónimos nombrados: `- backend_node_modules:/app/node_modules`
   - **NUNCA** montes volúmenes nombrados sobre directorios que el framework necesita borrar/recrear durante el hot-reload (ej. la carpeta `dist/` de NestJS), ya que Linux bloqueará la operación con `EBUSY`.

## TypeORM Database Driver & Queries
- El sistema utiliza **PostgreSQL** (`type: 'postgres'`) en lugar de SQLite. Asegúrate de instalar el paquete `pg` y de apuntar al contenedor `ms-postgres` configurado en el `docker-compose.yml`.
- **Regla crítica de TypeORM v0.3+**: NUNCA uses `findOne()` sin un filtro `where` explícito, ya que lanzará el error "You must provide selection conditions". Si necesitas el último registro, utiliza destructuring con `find`: `const [latest] = await repo.find({ order: { id: 'DESC' }, take: 1 });`

## Arquitectura del Backend (NestJS)
- **CORS**: Está explícitamente habilitado (`app.enableCors()`) en `main.ts` para permitir peticiones REST desde el cliente Vite (`puerto 5173`).
- **Flujo de Telemetría**: La data proveniente de las máquinas entra vía UDP en el puerto `4000` (o se genera con el `TelemetrySimulatorService` si `SIMULATE_TELEMETRY=true`). Ambos flujos:
  1. Emiten la data viva por WebSockets al frontend.
  2. Guardan el log histórico usando la entidad `TelemetryLog`.
  3. Disparan y guardan alertas Andon (`AndonAlert`) en la base de datos si se detectan fallas.
- **REST Endpoints**: La información histórica para poblar los gráficos de React (Top Defects, Output, Downtime) se sirve desde `/api/dashboard/stats`, la cual agrega y formatea los datos directamente desde las entidades `AndonAlert` y `TelemetryLog`.

## Guías de UI/UX (Frontend React)
- **Estilo Industrial Matte**: Todo el frontend utiliza colores oscuros y planos (`#111827`, `#1f2937`, `#374151`). Está prohibido el uso de *glassmorphism* o sombras difuminadas que resten seriedad al entorno industrial.
- **Colores Semánticos**: El rojo, amarillo y verde/teal están estrictamente reservados para indicar estados y alertas operativas, no como elementos puramente decorativos.
- **Componentes SVG Avanzados**: Para indicadores complejos (ej. el Productivity Shift gauge), se emplean arcos radiales matemáticos usando SVG (`strokeDasharray` y `strokeDashoffset`). Si los segmentos requieren cortes perfectamente rectos hacia el centro (radiales), se debe usar obligatoriamente `strokeLinecap="butt"`.

## Modo Cavernícola (Ahorro Extremo de Tokens)
- **Activo permanente**: Seguir estrictamente el skill `cavernicola` (`~/.gemini/config/skills/cavernicola/SKILL.md`).
- **Razonamiento (Thinking) y Respuestas**: Telegráfico, conciso, alta densidad de información. Cero saludos, cero cortesías, cero frases de relleno. Directo a la solución técnica.
