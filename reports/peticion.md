# Guía de Petición API - Generador de PDF (Reporte 8D)

El endpoint para la generación de reportes PDF ahora soporta el método **POST**. Esto permite que le envíes el objeto de datos (JSON) completo, de modo que la API genere el PDF basado en esa información y te lo devuelva directamente como archivo.

## Endpoint

**POST** `/api/generate-pdf`

### Cabeceras (Headers)

- `Content-Type: application/json`

### Cuerpo de la Petición (Request Body)

El endpoint espera un objeto de tipo `Incidencia` con el siguiente formato JSON. Todos los campos obligatorios deben estar presentes.

```json
{
  "id": "INC-001",
  "descripcion": "Descripción del problema inicial encontrado en la línea",
  "area": "Línea de Ensamblaje / Estación X",
  "severidad": "Media", // Opciones: "Baja", "Media", "Alta", "Crítica"
  "estado": "Pendiente", // Opciones: "Pendiente", "En Auditoría", "Validada", "Mitigada", "Cerrada"
  "causaRaiz": "Descripción de la causa raíz determinada",
  "creadoEn": "2023-10-01T10:00:00Z", // Timestamp (ISO 8601)
  "actualizadoEn": "2023-10-02T10:00:00Z", // Opcional
  "nombreAuditor": "Juan", // Opcional
  "apellidoAuditor": "Pérez", // Opcional
  "fechaValidacion": "2023-10-03T10:00:00Z", // Opcional
  "notasAuditor": "Notas del auditor sobre la validación", // Opcional
  "analisis": {
    "titulo": "Título formal del reporte 8D",
    "resumen": "Resumen ejecutivo de la anomalía y su resolución",
    "severidad": "Media",
    "disciplinas8d": {
      "d1_equipo": ["Líder de Calidad", "Ingeniero de Proceso", "Operador"],
      "d2_descripcion": "Definición completa 5W2H del problema",
      "d3_contencion": "Acciones de contención inmediata",
      "d4_causaRaiz": "Análisis causal final",
      "d5_accionesCorrectivas": "Plan de acciones correctivas",
      "d6_implementacion": "Resultados de la implementación (Lote piloto)",
      "d7_prevencion": "Medidas de prevención de recurrencia (Actualización AMEF)",
      "d8_cierre": "Cierre y felicitación al equipo"
    },
    "ishikawa": [
      {
        "id": "ish-1",
        "categoria": "Maquinaria", // Opciones: "Mano de Obra", "Maquinaria", "Materiales", "Método", "Medio Ambiente", "Medición"
        "factor": "Desgaste en herramienta",
        "descripcion": "La herramienta de corte presentó desgaste prematuro",
        "impacto": "Alto", // Opciones: "Alto", "Medio", "Bajo"
        "esCausaRaiz": true
      }
    ],
    "cincoPorques": [
      {
        "id": "why-1",
        "nivel": 1,
        "pregunta": "¿Por qué falló la pieza?",
        "respuesta": "Porque había un desvío dimensional."
      },
      // ... Deben enviarse EXACTAMENTE 5 objetos (nivel 1 al 5)
      {
        "id": "why-5",
        "nivel": 5,
        "pregunta": "¿Por qué ... ?",
        "respuesta": "Causa sistémica raíz detectada."
      }
    ],
    "acciones": [
      {
        "id": "act-1",
        "disciplina": "D3", // Opciones: "D3", "D5", "D7"
        "tipo": "Contención",
        "descripcion": "Segregar lote sospechoso",
        "responsable": "Equipo de Calidad",
        "estado": "Completada" // Opciones: "Pendiente", "En Proceso", "Completada"
      }
    ],
    "evidencias": [
      {
        "id": "evi-1",
        "tipo": "Telemetría",
        "descripcion": "Falla registrada en el sensor de temperatura",
        "valor": "110°C", // Opcional
        "url": "http://link-a-imagen-opcional.com/img.jpg" // Opcional
      },
      {
        "id": "evi-2",
        "tipo": "Telemetría",
        "descripcion": "Falla registrada por presión alta (Tiro Corto)",
        "valor": "150 bar"
      }
    ]
  }
}
```

## Respuesta del Servidor (Response)

Si la solicitud es exitosa y el JSON es válido, la API responderá con:

- **Status Code:** `200 OK`
- **Content-Type:** `application/pdf`
- **Body:** El archivo PDF binario (stream) listo para ser guardado.

*Nota:* Si el motor interno de Gotenberg llega a estar inactivo (modo *fallback*), la API responderá con un HTML dinámico (`Content-Type: text/html`) que se autodescargará como PDF al abrirse en el navegador web del cliente.

## Ejemplo de uso con Fetch (JavaScript / TypeScript)

```javascript
async function generarDescargarPDF(datosIncidencia) {
  const response = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosIncidencia)
  });

  if (!response.ok) {
    console.error('Error al generar el PDF');
    return;
  }

  // 1. Obtener el archivo resultante como un Blob
  const blob = await response.blob();
  
  // 2. Crear un enlace temporal para forzar la descarga en el navegador
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Reporte-8D-${datosIncidencia.id}-Carta.pdf`; // O el nombre deseado
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
```
