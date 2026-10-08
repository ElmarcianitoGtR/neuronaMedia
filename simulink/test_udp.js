const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`Error del servidor:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  // Verificamos que el paquete sea exactamente de 18 bytes (9 uint16)
  if (msg.length !== 18) {
    console.log(`Paquete ignorado: tamaño incorrecto (${msg.length} bytes)`);
    return;
  }
  
  // Extraer los datos en formato Little-Endian
  const maquinaId = msg.readUInt16LE(0);
  const etapa = msg.readUInt16LE(2);
  const falla = msg.readUInt16LE(4);
  const piezasOk = msg.readUInt16LE(6);
  const scrap = msg.readUInt16LE(8);
  
  // Extraer los floats
  const temp = msg.readFloatLE(10);
  const press = msg.readFloatLE(14);
  
  // Limpiar consola y mostrar datos actualizados (tipo dashboard)
  console.clear();
  console.log(`--- DATOS RECIBIDOS DESDE SIMULINK (${rinfo.address}:${rinfo.port}) ---`);
  console.log(`Máquina ID   : ${maquinaId}`);
  console.log(`Etapa Ciclo  : ${etapa} (1=Cerrando, 2=Inyectando, ...)`);
  console.log(`Estado/Falla : ${falla} (0=OK, 1=Temp, 2=Presion)`);
  console.log(`Piezas OK    : ${piezasOk}`);
  console.log(`Scrap        : ${scrap}`);
  console.log(`Temperatura  : ${temp.toFixed(2)} °C`);
  console.log(`Presión      : ${press.toFixed(2)} bar`);
  console.log('-------------------------------------------------------------');
});

server.on('listening', () => {
  const address = server.address();
  console.log(`[TEST] Escuchando tráfico UDP simulado en el puerto ${address.port}...`);
  console.log(`Puedes darle "Run" a tu simulación en Simulink ahora.`);
});

// El backend de tu compañero escucha en el puerto 4000
server.bind(4000);
