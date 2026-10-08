# Protocolo de Comunicación UDP (Simulink ↔ Servidor Maestro)

Este documento define la estructura de comunicación basada en **Sockets UDP** para la transmisión de la telemetría del Gemelo Digital (Simulink) hacia el Servidor Maestro.

## 1. Arquitectura de Red
La comunicación se realiza enviando datagramas UDP binarios crudos, optimizando la latencia para la transmisión en tiempo real.
* **Servidor (Receptor) UDP:** El backend (NestJS) escucha en la dirección IP local y en el puerto UDP designado (por defecto `127.0.0.1:4000`).
* **Cliente (Emisor) UDP:** Simulink actúa como cliente emisor, empaquetando los valores de los sensores físicos en un arreglo de bytes y transmitiéndolos en cada ciclo de simulación.
* **Formato del Paquete:** Array binario continuo de 18 bytes (formado por 9 valores `uint16` transmitidos en formato *Little-Endian*).

## 2. Mapa del Payload (Datagrama de 18 Bytes)
Los datos enteros ocupan un espacio de 16 bits (2 bytes). Los valores numéricos con decimales (Float32) requeridos para las variables físicas continuas se empaquetan dividiéndose en **dos elementos contiguos de 16 bits**.

| Índice `uint16` | Offset (Bytes) | Variable | Tipo de Dato | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `0` | `0-1` | **Máquina ID** | `uint16` | Identificador único de la inyectora (Ej. `1` para M-01). |
| `1` | `2-3` | **Etapa del Ciclo** | `uint16` | 1=Cerrando, 2=Inyectando, 3=Manteniendo, 4=Enfriando, 5=Abriendo, 6=Expulsando. |
| `2` | `4-5` | **Falla / Estado** | `uint16` | `0` = OK, `1` = Falla Térmica, `2` = Falla de Presión. |
| `3` | `6-7` | **Piezas OK** | `uint16` | Contador acumulado de piezas procesadas correctamente. |
| `4` | `8-9` | **Scrap** | `uint16` | Contador acumulado de piezas defectuosas por alarmas. |
| `5` | `10-11` | **Temperatura (LGB)**| `float32` | Parte menos significativa (*Little-Endian*) de la temperatura del barril (°C). |
| `6` | `12-13` | **Temperatura (MSB)**| (Cont.) | Parte más significativa de la temperatura del barril (°C). |
| `7` | `14-15` | **Presión (LSB)** | `float32` | Parte menos significativa (*Little-Endian*) de la presión hidráulica de inyección (bar). |
| `8` | `16-17` | **Presión (MSB)** | (Cont.) | Parte más significativa de la presión hidráulica de inyección (bar). |

---
*Nota de Endianness:* El sistema subyacente transmite en **Little-Endian**. Las variables de 32 bits (Float32) se reensamblan en el backend leyendo los 4 bytes de los índices correspondientes.
