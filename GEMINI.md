# Repo Directives

## Modo Cavernícola (Ahorro Extremo de Tokens)
- Activo permanentemente.
- Respuestas y razonamiento telegráficos, concisos, cero relleno, cero cortesías.
- Enfocado en código, comandos y resultados directos.

## Contexto de Arquitectura y Reglas del Proyecto (Hackathon)
1. **Stack Tecnológico:**
   - Frontend: React (Vite) en `master-slave/frontend`.
   - Backend: NestJS en `master-slave/backend` (Puerto 3000).
   - Base de Datos Relacional: PostgreSQL (Entity: TelemetryLog, AndonAlert).
   - Base de Datos de Grafos: Memgraph (Bolt en `bolt://graph-db:7687`).
   - PDF Engine: Gotenberg + Astro en `reports/quality-hub` (Puerto 4321).
   - Telemetría: MATLAB / Simulink dispara UDP (Little-Endian, 18 bytes) al puerto 4000 de NestJS.
2. **Flujo de Datos (Regla de Oro):**
   - **Cero Dummies/Hardcodes:** Todo el frontend (Dashboard, Andon, Gráficas de Paros, Top Defectos) se genera de forma dinámica escaneando las máquinas que existan físicamente en PostgreSQL. Si la DB está vacía, no se dibujan interfaces falsas ni datos mock.
   - **Reactividad UDP:** El backend hace "Debounce" (solo guarda en PG si el contador de `actualUnits` avanza) para no saturar la DB, pero retransmite el estado en vivo vía WebSocket cada milisegundo al Frontend.
   - **Fallback Frontend:** Si se desconecta el WebSocket, el frontend utiliza el `latestTelemetry` servido desde la DB local para que las gráficas no caigan a 0.
3. **Terminología UI:**
   - Utilizar siempre español.
   - Usar el término "Reporte Carta" en lugar de "8D", "Reporte de Fallas", o "A3".
   - Todo número de conteo (ej. defectos) debe mostrar " incid." (incidencias) en vez de "100%", ya que las gráficas manejan conteos absolutos reales.
