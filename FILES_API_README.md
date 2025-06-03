# API de Archivos - Endpoints Implementados

Esta API proporciona funcionalidades completas para el manejo de archivos con base de datos PostgreSQL, integrada con el sistema de productos existente.

## 🚀 Endpoints Disponibles

### 1. **POST** `/api/upload/` - Subir un Archivo
Sube un solo archivo al servidor y lo asocia opcionalmente a un producto.

**Parámetros:**
- `file` (form-data): El archivo a subir
- `product_id` (form-data, opcional): ID del producto al que asociar el archivo

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/upload/ \
  -F "file=@/path/to/your/file.pdf" \
  -F "product_id=1"
```

**Respuesta exitosa (201):**
```json
{
  "message": "Archivo subido exitosamente",
  "file": {
    "id": 1,
    "originalName": "documento.pdf",
    "filename": "documento.pdf",
    "size": 102400,
    "uploadedAt": "2023-12-20T10:30:45.123Z",
    "productId": 1
  }
}
```

---

### 2. **POST** `/api/upload-multiple/` - Subir Múltiples Archivos
Sube varios archivos al mismo tiempo (máximo 10) y los asocia opcionalmente a un producto.

**Parámetros:**
- `files` (form-data): Los archivos a subir
- `product_id` (form-data, opcional): ID del producto al que asociar los archivos

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/upload-multiple/ \
  -F "files=@/path/to/file1.pdf" \
  -F "files=@/path/to/file2.jpg" \
  -F "product_id=2"
```

**Respuesta exitosa (201):**
```json
{
  "message": "2 archivos subidos exitosamente",
  "files": [
    {
      "id": 2,
      "originalName": "file1.pdf",
      "filename": "file1.pdf",
      "size": 102400,
      "uploadedAt": "2023-12-20T10:30:45.123Z",
      "productId": 2
    },
    {
      "id": 3,
      "originalName": "file2.jpg",
      "filename": "file2.jpg",
      "size": 204800,
      "uploadedAt": "2023-12-20T10:30:45.456Z",
      "productId": 2
    }
  ]
}
```

---

### 3. **GET** `/api/files/{file_id}` - Descargar Archivo por ID
Descarga un archivo usando su ID.

**Parámetros de ruta:**
- `file_id`: ID numérico del archivo

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:3000/api/files/1 \
  -o downloaded_file.pdf
```

**Respuesta:** El archivo se descarga directamente con los headers apropiados.

---

### 4. **GET** `/api/files/name/{file_name}` - Leer Archivo por Nombre
Lee información y contenido de un archivo (para archivos de texto muestra el contenido).

**Parámetros de ruta:**
- `file_name`: Nombre del archivo

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:3000/api/files/name/documento.pdf
```

**Respuesta para archivo de texto (200):**
```json
{
  "file": {
    "id": 4,
    "originalName": "script.js",
    "filename": "script.js",
    "mimetype": "application/octet-stream",
    "size": 1024,
    "uploadedAt": "2023-12-20T10:30:45.789Z",
    "productId": 1,
    "productName": "Máquina multipower"
  },
  "content": "console.log('Hello World!');"
}
```

**Respuesta para archivo binario (200):**
```json
{
  "file": {
    "id": 1,
    "originalName": "documento.pdf",
    "filename": "documento.pdf",
    "mimetype": "application/octet-stream",
    "size": 102400,
    "uploadedAt": "2023-12-20T10:30:45.123Z",
    "productId": 1,
    "productName": "Máquina multipower"
  },
  "message": "Archivo binario - use /files/{file_id} para descargar"
}
```

---

### 5. **DELETE** `/api/files/{file_name}` - Eliminar Archivo
Elimina un archivo de la base de datos.

**Parámetros de ruta:**
- `file_name`: Nombre del archivo

**Ejemplo cURL:**
```bash
curl -X DELETE http://localhost:3000/api/files/documento.pdf
```

**Respuesta exitosa (200):**
```json
{
  "message": "Archivo eliminado exitosamente",
  "file": {
    "id": 1,
    "originalName": "documento.pdf",
    "filename": "documento.pdf"
  },
  "physicalFileDeleted": true
}
```

---

### 6. **GET** `/api/files/` - Listar Todos los Archivos
Obtiene una lista de todos los archivos almacenados con información del producto asociado.

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:3000/api/files/
```

**Respuesta exitosa (200):**
```json
{
  "message": "3 archivos encontrados",
  "files": [
    {
      "id": 3,
      "originalName": "manual.pdf",
      "filename": "manual.pdf",
      "mimetype": "application/octet-stream",
      "size": 204800,
      "uploadedAt": "2023-12-20T10:30:45.456Z",
      "productId": 2,
      "productName": "Producto Premium"
    },
    {
      "id": 2,
      "originalName": "imagen.jpg",
      "filename": "imagen.jpg",
      "mimetype": "application/octet-stream",
      "size": 102400,
      "uploadedAt": "2023-12-20T10:30:45.123Z",
      "productId": 1,
      "productName": "Máquina multipower"
    }
  ]
}
```

---

## 📋 Estructura de Base de Datos

**Utiliza la tabla `files` existente:**

```sql
-- Estructura de la tabla files existente
files (
    file_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product_id INTEGER REFERENCES products(id),
    content BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255)
);
```

**Integración con productos:**
- JOIN con tabla `products` para mostrar nombre del producto
- Campo `product_id` para asociar archivos a productos específicos

## ⚙️ Configuraciones

- **Almacenamiento:** Base de datos PostgreSQL (campo `content` como `bytea`)
- **Tamaño máximo de archivo:** 50MB
- **Archivos múltiples:** Máximo 10 archivos por vez
- **Tipos de archivo:** Todos permitidos
- **Integración:** Asociación opcional con productos via `product_id`

## 🏗️ Arquitectura

### Organización del código:
- **Queries:** `queries/queries.js` - Todas las consultas SQL organizadas
- **Modelo:** `models/files.model.js` - Lógica de acceso a datos
- **Controlador:** `controllers/files.controllers.js` - Lógica de negocio
- **Rutas:** `routes/files.routes.js` - Definición de endpoints

### Flujo de archivos:
1. **Upload:** Archivo temporal → Lectura → Almacenamiento en BD como bytea → Eliminación temporal
2. **Storage:** Archivos almacenados completamente en base de datos
3. **Download:** Lectura desde BD → Envío directo al cliente

## 🔧 Ruta de Prueba

**GET** `/api/test` - Verifica que la API de archivos esté funcionando

```bash
curl -X GET http://localhost:3000/api/test
```

**Respuesta:**
```json
{
  "message": "API de archivos funcionando correctamente",
  "timestamp": "2023-12-20T10:30:45.123Z"
}
```

## 🚨 Códigos de Error Comunes

- **400:** Archivo no proporcionado o error en multer
- **404:** Archivo no encontrado
- **500:** Error interno del servidor

## 📝 Notas Importantes

1. **Almacenamiento en BD:** Los archivos se almacenan como `bytea` en PostgreSQL
2. **Sin archivos físicos:** No se mantienen copias en el sistema de archivos
3. **Integración con productos:** Archivos asociados a productos específicos
4. **Queries organizadas:** Todas las consultas SQL están en `queries/queries.js`
5. **Detección de texto:** Archivos de texto muestran contenido, binarios requieren descarga
6. **Nombres únicos:** Se usa el nombre original del archivo

## ✅ Estado de la Implementación

**¡COMPLETADO!** ✅ Todos los endpoints funcionando con la estructura existente:

- ✅ Upload single file (con asociación a productos)
- ✅ Upload multiple files (con asociación a productos)
- ✅ Download file by ID (desde BD)
- ✅ Read file by name (con detección de contenido)
- ✅ Delete file by name (desde BD)
- ✅ List all files (con información de productos)
- ✅ Database integration con tabla `files` existente
- ✅ Queries organizadas en archivo separado
- ✅ Almacenamiento como bytea en PostgreSQL
- ✅ Integración completa con sistema de productos 