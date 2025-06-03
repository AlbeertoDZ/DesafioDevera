# Files Management API

Sistema completo de gestión de archivos integrado con PostgreSQL, Tally Forms y sistema de onboarding.

## Características Principales

- ✅ **Almacenamiento en Base de Datos**: Archivos almacenados como `bytea` en PostgreSQL
- ✅ **Integración con Productos**: Asociación de archivos con productos existentes
- ✅ **Integración con Tally**: Procesamiento automático de archivos desde formularios Tally
- ✅ **Sistema de Onboarding**: Carga de productos con archivos asociados
- ✅ **Interfaz Web**: Componentes React para subir y gestionar archivos
- ✅ **Procesamiento Temporal**: Uso de directorio `uploads/` como almacenamiento temporal
- ✅ **Detección de Contenido**: Distinción entre archivos de texto y binarios

## Estructura de Base de Datos

Utiliza la tabla existente `files`:
```sql
files (
  file_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  product_id INTEGER REFERENCES products(id),
  content BYTEA NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  image VARCHAR(255)
)
```

## Endpoints API

### 1. Subir Archivo Individual
**POST** `/api/files/upload/`

**Parámetros:**
- `file` (file): El archivo a subir
- `product_id` (opcional): ID del producto a asociar

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Archivo subido correctamente",
  "data": {
    "file_id": 1,
    "filename": "unique_filename.pdf",
    "originalName": "documento.pdf",
    "size": 2048,
    "productId": 5
  }
}
```

### 2. Subir Múltiples Archivos
**POST** `/api/files/upload-multiple/`

**Parámetros:**
- `files` (array): Los archivos a subir (máximo 10)
- `product_id` (opcional): ID del producto a asociar

### 3. Listar Archivos
**GET** `/api/files/`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "file_id": 1,
      "name": "archivo.pdf",
      "original_name": "documento.pdf",
      "size": 2048,
      "created_at": "2024-01-01T00:00:00.000Z",
      "product_id": 5,
      "product_name": "Producto ABC"
    }
  ]
}
```

### 4. Descargar Archivo
**GET** `/api/files/{file_id}`

Retorna el archivo para descarga directa.

### 5. Obtener Información de Archivo
**GET** `/api/files/name/{file_name}`

**Respuesta para archivos de texto:**
```json
{
  "success": true,
  "data": {
    "file_id": 1,
    "name": "archivo.txt",
    "content": "Contenido del archivo...",
    "isText": true
  }
}
```

### 6. Eliminar Archivo
**DELETE** `/api/files/name/{file_name}`

### 7. **NUEVO** - Subir Productos con Archivos (Onboarding)
**POST** `/api/files/subir-productos`

**Parámetros FormData:**
- `productos[0][nombre]`: Nombre del producto
- `productos[0][url]`: URL del producto
- `productos[0][industria]`: Industria del producto
- `archivos[]`: Archivos asociados a los productos

**Respuesta:**
```json
{
  "success": true,
  "message": "Productos y archivos procesados correctamente",
  "data": {
    "productos": [...],
    "archivos": [...],
    "totalProductos": 3,
    "totalArchivos": 2
  }
}
```

### 8. **NUEVO** - Webhook de Tally
**POST** `/api/files/tally-webhook`

Endpoint para recibir webhooks de Tally cuando se completen formularios que contengan archivos.

**Funcionalidad:**
- Procesa respuestas de formularios Tally
- Descarga automáticamente archivos adjuntos
- Almacena archivos en la base de datos
- Procesa todos los tipos de campos del formulario

## Integración Frontend

### Componente ProductDetail
- ✅ Botón "Adjuntar archivo" funcional
- ✅ Lista de archivos del producto
- ✅ Descarga de archivos
- ✅ Carga de archivos con progreso

### Sistema de Onboarding
- ✅ **OnboardingStep1**: Captura URL y datos de ventas
- ✅ **OnboardingStep2**: Formulario Tally embebido
- ✅ **OnboardingStep3**: Selección de productos y carga de archivos

### Integración con Tally
- ✅ Script de Tally cargado dinámicamente
- ✅ Formulario embebido con iframe
- ✅ Webhook para procesar respuestas automáticamente

## Configuración

### 1. Dependencias
```bash
npm install multer
```

### 2. Variables de Entorno
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
```

### 3. Configuración Tally
Para usar webhooks de Tally:
1. Configurar webhook URL: `https://tu-dominio.com/api/files/tally-webhook`
2. Seleccionar evento: "Form Response"
3. Incluir campos de archivo en el formulario

### 4. Estructura de Directorios
```
api/
├── controllers/files.controllers.js
├── models/files.model.js
├── routes/files.routes.js
├── queries/queries.js
├── middleware/multer.js
└── uploads/ (temporal, en .gitignore)

client/src/components/
├── ProductDetail/ProductDetail.jsx
└── Onboarding/
    ├── OnboardingStep1.jsx
    ├── OnboardingStep2.jsx (Tally)
    └── OnboardingStep3.jsx (Files)
```

## Flujo de Trabajo

### Onboarding Completo:
1. **Paso 1**: Usuario ingresa URL y datos de ventas
2. **Paso 2**: Usuario completa formulario Tally embebido
3. **Paso 3**: Usuario selecciona productos y sube archivos
4. **Backend**: Procesa productos y archivos, los almacena en BD

### Gestión en ProductDetail:
1. Usuario ve botón "Adjuntar archivo" 
2. Selecciona archivo, se sube automáticamente
3. Archivo aparece en lista de archivos del producto
4. Usuario puede descargar archivos existentes

### Webhooks de Tally:
1. Usuario completa formulario Tally con archivos
2. Tally envía webhook a `/api/files/tally-webhook`
3. Sistema descarga archivos automáticamente
4. Archivos se almacenan en BD con prefijo `tally_`

## Pruebas

### Testear Onboarding:
```bash
# Probar endpoint de productos
curl -X POST http://localhost:3001/api/files/subir-productos \
  -F "productos[0][nombre]=Producto Test" \
  -F "productos[0][url]=https://test.com" \
  -F "productos[0][industria]=Test" \
  -F "archivos=@test.pdf"
```

### Testear Upload Individual:
```bash
curl -X POST http://localhost:3001/api/files/upload/ \
  -F "file=@test.pdf" \
  -F "product_id=1"
```

## Notas Importantes

- 📁 **Archivos temporales**: Se almacenan en `uploads/` y se eliminan después del procesamiento
- 🔗 **Asociación con productos**: Los archivos se pueden asociar con productos existentes en la BD
- 🔒 **Seguridad**: Validación de tipos de archivo y tamaño máximo (50MB)
- 🌐 **Tally**: Integración completa con formularios web para captura automática de archivos
- ♻️ **Limpieza**: Eliminación automática de archivos temporales en caso de error

---

**Última actualización**: Integración completa con Tally Forms y sistema de onboarding 