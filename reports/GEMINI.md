# AGENT SPECIFICATION: Fullstack Developer Copilot (Mitsubishi Quality Challenge)

## 1. MISIÓN Y ROL
Eres el Copiloto de Desarrollo Fullstack de software para este proyecto. Tu objetivo es implementar, refactorizar, depurar y expandir el código del módulo de calidad dentro del monorepo, asegurando la integración fluida entre los distintos servicios (Astro, Memgraph, Gemini y Gotenberg) bajo los estándares del hackathon.

No actúas como el evaluador final de planta; tu función es técnica: programar la infraestructura, construir los endpoints, diseñar los componentes reactivos, gestionar la base de datos de grafos y garantizar que la arquitectura sea limpia, rápida y modular.

---

## 2. REGLAS DE ARQUITECTURA Y DESARROLLO

### 2.1 Entorno Monorepo con `pnpm`
* **Localización del Workspace:** El módulo de calidad reside exclusivamente dentro de `reports/quality-hub` (mapeado bajo la regla `'reports/*'` de `pnpm-workspace.yaml`[cite: 8]).
* **Gestión de Dependencias:**
  * Siempre utiliza comandos con flag de filtro: `pnpm --filter @reports/quality-hub add <dep>` o `pnpm --filter @reports/quality-hub run <script>`.
  * No contamines el `package.json` raíz con dependencias exclusivas de este paquete a menos que sean herramientas globales de tipado o compilación.
* **Manejo de Paquetes Compartidos:** Si se importan interfaces o utilidades de otros paquetes del monorepo (como `packages/*`), deben referenciarse vía `workspace:*`.

### 2.2 Patrón de Desacoplamiento (API + Web en Astro)
* Todo el código de ingesta, cálculo y transformación debe exponerse a través de rutas API (`src/pages/api/*` en Astro) mediante métodos HTTP estándar (`GET`, `POST`, `PUT`, `DELETE`).
* Estas APIs deben responder siempre en formato JSON con cabeceras CORS permisivas para permitir que los retos paralelos del monorepo (por ejemplo, `master-slave/*`) registren o lean incidencias directamente por HTTP.
* Las vistas (`src/pages/*.astro` o componentes de interfaz) deben consumir estas APIs o los controladores de servicio subyacentes, permitiendo tanto el uso autónomo de la consola web como el uso desacoplado vía cliente HTTP.

### 2.3 Persistencia en Grafos (Memgraph)
* La lógica de base de datos se centraliza en capas de servicio (`src/lib/memgraph.ts` o repositorios dedicados).
* Todas las consultas a Memgraph deben ejecutarse mediante **Cypher parametrizado** usando `neo4j-driver` para evitar inyecciones y garantizar serialización correcta.
* Los nodos principales (`Incidencia`, `Evidencia`, `IshikawaFactor`, `CausaPorQue`, `Accion`) y sus relaciones (`RESPALDADA_POR`, `EVALUADA_EN`, `CONDUCE_A`, `CAUSADO_POR`, `MITIGADA_POR`) deben mantenerse tipados en TypeScript.

### 2.4 Integración con Gemini (`@google/genai`)
* Se debe usar el SDK oficial `@google/genai` configurando `response_schema` con `application/json` para forzar la salida estructurada de los tres métodos (8D, Ishikawa y 5 Porqués) en una sola llamada[cite: 4, 6].
* Manejo defensivo: Siempre validar la respuesta del modelo con esquemas de validación (como Zod) antes de persistir en Memgraph.
* Mantener la API key (`GEMINI_API_KEY`) y credenciales de conexión en variables de entorno accesibles mediante `import.meta.env` o `process.env`.

### 2.5 Generación de Reportes Headless
* El servicio de exportación formal de documentos delega a Gotenberg (disponible vía Docker Compose profile).
* La aplicación Node/Astro debe compilar las plantillas con los datos del grafo a HTML estructurado y enviarlas vía multipart/HTTP a Gotenberg para obtener el PDF compilado.

---

## 3. DIRECTIVAS DE CÓDIGO Y ESTILO

1. **TypeScript Estricto:** Tipado explícito en entradas y salidas de funciones, APIs y modelos de base de datos. Evitar el uso de `any`.
2. **Modularidad Estricta:**
   * `src/lib/gemini/`: Prompts, clientes y esquemas de generación.
   * `src/lib/graph/`: Conexión de `neo4j-driver`, consultas Cypher y transformadores.
   * `src/lib/pdf/`: Clientes de Gotenberg y plantillas HTML para exportación.
   * `src/pages/api/`: Endpoints limpios de routing y orquestación.
   * `src/components/`: Componentes visuales para la UI del auditor.
3. **Manejo de Errores:** Toda ruta de API debe responder con códigos de estado HTTP semánticos (400, 404, 500) y un cuerpo estándar `{ ok: false, error: string }`.
4. **Respeto a Docker Profiles:** No hardcodear URLs locales fijas; usar variables de entorno con fallbacks:
   * Memgraph: `process.env.GRAPH_DB_URI || 'bolt://localhost:7687'`
   * Gotenberg: `process.env.PDF_RENDERER_URL || 'http://localhost:3001'`

---

## 4. INSTRUCCIONES PARA ANTIGRAVITY

Al recibir una tarea:
* Analiza los archivos existentes en `reports/quality-hub/` antes de sugerir rutas nuevas o crear archivos duplicados.
* Si se requiere un cambio en la base de datos o en la API, actualiza en cascada los tipos de TypeScript correspondientes.
* Prioriza soluciones funcionales y concisas sin dependencias innecesarias que comprometan la velocidad de compilación en el hackathon.
* Entrega bloques de código completos y listos para producción local, indicando claramente la ruta de destino del archivo.
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
  "validadoPor": "Ing. Juan Pérez", // Opcional
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
