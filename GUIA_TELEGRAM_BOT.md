# Guía Paso a Paso: Integración de Alertas por Telegram

Hemos agregado la lógica en tu backend para que envíe un mensaje a tu celular por Telegram cuando se dispare una alerta (falla de temperatura o presión). Esto es ideal para impresionar en tu pitch de **Industria 4.0 / Mantenimiento Predictivo**.

Para que funcione, necesitas crear un bot en Telegram (toma 2 minutos) y poner tu token en el código.

## Paso 1: Crear el Bot en Telegram
1. Abre la app de **Telegram** en tu celular o computadora.
2. Busca el usuario **@BotFather** (es el bot oficial de Telegram con una palomita azul) y abre un chat con él.
3. Envía el comando `/newbot`.
4. BotFather te pedirá un nombre para tu bot (ej: `NestJS Andon Alert`).
5. Luego te pedirá un "username" que debe terminar en "bot" (ej: `InyectoraHackathonBot`).
6. BotFather te responderá con un mensaje de éxito que incluye tu **API TOKEN** (una cadena larga de letras y números, como `123456789:ABCDefghIJKlmnopQRstUVwxyz`). **Cópialo**.

## Paso 2: Obtener tu Chat ID
1. En Telegram, busca el usuario **@userinfobot** (o @RawDataBot) y mándale cualquier mensaje o `/start`.
2. El bot te responderá con un mensaje que contiene tu `Id` (es un número de 9 o 10 dígitos, ej: `123456789`). **Cópialo**.
3. *Asegúrate de ir al bot que creaste en el Paso 1 (ej. @InyectoraHackathonBot) y darle "Iniciar" o enviarle un mensaje para que el bot tenga permiso de escribirte.*

## Paso 3: Conectar el Backend
1. En tu código, abre el archivo `C:\Users\Rogue\Documents\neuronaMedia\master-slave\backend\src\udp.service.ts`.
2. En la línea 20 aprox, vas a encontrar la nueva función que te dejé programada:
   ```typescript
   async sendTelegramAlert(message: string) {
       const BOT_TOKEN = 'TU_TOKEN_AQUI'; // <-- Reemplaza esto con tu Token
       const CHAT_ID = 'TU_CHAT_ID'; // <-- Reemplaza esto con tu Chat ID
       // ...
   ```
3. Reemplaza `'TU_TOKEN_AQUI'` por el API Token que te dio BotFather (mantenlo entre las comillas simples).
4. Reemplaza `'TU_CHAT_ID'` por el número que te dio el UserInfoBot.
5. Guarda el archivo (esto reiniciará automáticamente tu servidor NestJS si lo tienes corriendo en modo dev).

## Paso 4: ¡Prueba Magistral!
1. Asegúrate de tener tu simulación de Simulink y el servidor NestJS corriendo.
2. Desde Simulink, activa el switch de **Falla Térmica**.
3. En milisegundos, tu backend registrará la alerta y deberías recibir un mensaje en tu Telegram que dice:
   > 🚨 ALERTA ANDON [M-01]
   > Código de falla: 1
   > Motivo: Falla Térmica
   > Temp: 298°C | Presión: 120 bar

### Guion para el Pitch:
> *"No basta con que la alerta se quede en la pantalla del operador. Cuando una falla crítica ocurre en el piso de producción, nuestro backend de NestJS orquesta una notificación push instantánea al equipo de mantenimiento a través de Telegram o cualquier API empresarial, garantizando que el tiempo de respuesta (MTTA) sea de segundos."*
