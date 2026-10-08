# Protocolo de Comunicación Modbus TCP (Simulink ↔ Servidor Maestro)

Este documento define la estructura de comunicación basada en el estándar industrial **Modbus TCP** para la transmisión de la telemetría del PLC (Simulink) hacia el Servidor Maestro.

## 1. Arquitectura Modbus
La comunicación se basa en el modelo Cliente/Servidor mediante la escritura de "Registros" de retención de 16 bits (2 bytes).
* **Servidor (Esclavo) Modbus:** El backend actúa como el servidor alojando los registros y escuchando en el puerto TCP designado.
* **Cliente (Maestro) Modbus:** Simulink actúa como cliente, conectándose al servidor y actualizando (escribiendo) los valores de los sensores virtuales en cada ciclo de simulación.
* **Tipo de Registros:** Holding Registers (Direcciones 4xxxx).

## 2. Mapa de Registros (Holding Registers 4xxxx)
Los datos enteros numéricos ocupan un solo registro de 16 bits. Los valores numéricos con decimales (Float32) requeridos para variables físicas se empaquetan dividiéndose en **dos registros contiguos**.

| Dirección (Base 1) | Offset (Base 0) | Variable | Tipo de Dato | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `40001` | `0` | **Máquina ID** | `uint16` | Identificador único de la inyectora (Ej. `1` para M-01). |
| `40002` | `1` | **Etapa del Ciclo** | `uint16` | 1=Cerrando, 2=Inyectando, 3=Manteniendo, 4=Enfriando, 5=Abriendo. |
| `40003` | `2` | **Falla / Estado** | `uint16` | `0` = OK, `1` = Falla Térmica, `2` = Falla de Presión. |
| `40004` | `3` | **Piezas OK** | `uint16` | Contador acumulado de piezas procesadas correctamente. |
| `40005` | `4` | **Scrap** | `uint16` | Contador acumulado de piezas defectuosas por alarmas. |
| `40006` | `5` | **Temperatura (High)**| `float32` | Parte alta de la temperatura actual del barril (°C). |
| `40007` | `6` | **Temperatura (Low)** | (Cont.) | Parte baja de la temperatura del barril (°C). |
| `40008` | `7` | **Presión (High)** | `float32` | Parte alta de la presión hidráulica de inyección (bar). |
| `40009` | `8` | **Presión (Low)** | (Cont.) | Parte baja de la presión hidráulica de inyección (bar). |

---
*Nota de Endianness:* Los registros continuos de 32 bits (Float) se emparejan para reconstruir el valor decimal flotante.
