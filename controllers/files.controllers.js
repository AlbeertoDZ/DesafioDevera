const File = require('../models/files.model');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// Configuración de multer para almacenar archivos temporalmente
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        // Crear directorio si no existe
        require('fs').mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generar nombre único temporal
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
    cb(null, true);
};

// Configuración de multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB máximo
    }
});

// Middleware para un solo archivo
const uploadSingle = upload.single('file');

// Middleware para múltiples archivos
const uploadMultiple = upload.array('files', 10);

// Inicializar
const initializeFilesTable = async () => {
    try {
        await File.createFilesTable();
    } catch (error) {
        console.error('Error inicializando:', error);
    }
};

initializeFilesTable();

// UPLOAD SINGLE FILE - POST /upload/
const uploadFile = async (req, res) => {
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.error('Error en multer:', err);
            return res.status(400).json({ 
                message: 'Error al subir archivo', 
                error: err.message 
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                message: 'No se proporcionó ningún archivo' 
            });
        }

        try {
            // Guardar en base de datos
            const fileData = {
                originalName: req.file.originalname,
                path: req.file.path,
                productId: req.body.product_id || null // Opcional: asociar a producto
            };

            const savedFile = await File.saveFileInfo(fileData);

            res.status(201).json({
                message: 'Archivo subido exitosamente',
                file: {
                    id: savedFile.file_id,
                    originalName: savedFile.name,
                    filename: savedFile.name,
                    size: savedFile.content ? savedFile.content.length : 0,
                    uploadedAt: savedFile.created_at,
                    productId: savedFile.product_id
                }
            });

        } catch (error) {
            console.error('Error guardando archivo:', error);
            // Eliminar archivo temporal si hay error
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error eliminando archivo temporal:', unlinkError);
            }
            
            res.status(500).json({ 
                message: 'Error al guardar archivo',
                error: error.message 
            });
        }
    });
};

// UPLOAD MULTIPLE FILES - POST /upload-multiple/
const uploadMultipleFiles = async (req, res) => {
    uploadMultiple(req, res, async (err) => {
        if (err) {
            console.error('Error en multer múltiple:', err);
            return res.status(400).json({ 
                message: 'Error al subir archivos', 
                error: err.message 
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                message: 'No se proporcionaron archivos' 
            });
        }

        try {
            const savedFiles = [];
            const errors = [];

            for (const file of req.files) {
                try {
                    const fileData = {
                        originalName: file.originalname,
                        path: file.path,
                        productId: req.body.product_id || null
                    };

                    const savedFile = await File.saveFileInfo(fileData);
                    savedFiles.push({
                        id: savedFile.file_id,
                        originalName: savedFile.name,
                        filename: savedFile.name,
                        size: savedFile.content ? savedFile.content.length : 0,
                        uploadedAt: savedFile.created_at,
                        productId: savedFile.product_id
                    });

                } catch (error) {
                    console.error(`Error guardando archivo ${file.filename}:`, error);
                    errors.push({
                        filename: file.filename,
                        error: error.message
                    });

                    try {
                        await fs.unlink(file.path);
                    } catch (unlinkError) {
                        console.error('Error eliminando archivo temporal:', unlinkError);
                    }
                }
            }

            res.status(201).json({
                message: `${savedFiles.length} archivos subidos exitosamente`,
                files: savedFiles,
                errors: errors.length > 0 ? errors : undefined
            });

        } catch (error) {
            console.error('Error procesando archivos múltiples:', error);
            res.status(500).json({ 
                message: 'Error al procesar archivos',
                error: error.message 
            });
        }
    });
};

// DOWNLOAD FILE BY ID - GET /files/{file_id}
const downloadFileById = async (req, res) => {
    const { file_id } = req.params;

    try {
        const file = await File.getFileById(file_id);
        
        if (!file || !file.content) {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        }

        // Establecer headers para descarga
        res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', file.content.length);
        
        // Enviar contenido binario
        res.send(file.content);

    } catch (error) {
        console.error('Error descargando archivo:', error);
        res.status(500).json({ 
            message: 'Error al descargar archivo',
            error: error.message 
        });
    }
};

// READ FILE BY NAME - GET /files/{file_name}
const readFileByName = async (req, res) => {
    const { file_name } = req.params;

    try {
        const file = await File.getFileByName(file_name);
        
        if (!file) {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        }

        // Intentar determinar si es texto
        let isText = false;
        let content = null;
        
        if (file.content) {
            try {
                content = file.content.toString('utf8');
                // Verificar si es texto válido
                isText = /^[\x20-\x7E\s]*$/.test(content);
            } catch (error) {
                isText = false;
            }
        }

        const response = {
            file: {
                id: file.id,
                originalName: file.original_name,
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size,
                uploadedAt: file.uploaded_at,
                productId: file.product_id,
                productName: file.product_name
            }
        };

        if (isText && content) {
            response.content = content;
        } else {
            response.message = 'Archivo binario - use /files/{file_id} para descargar';
        }

        res.json(response);

    } catch (error) {
        console.error('Error leyendo archivo:', error);
        res.status(500).json({ 
            message: 'Error al leer archivo',
            error: error.message 
        });
    }
};

// DELETE FILE BY NAME - DELETE /files/{file_name}
const deleteFileByName = async (req, res) => {
    const { file_name } = req.params;

    try {
        const deletedFile = await File.deleteFile(file_name);
        
        if (!deletedFile) {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        }

        res.json({
            message: 'Archivo eliminado exitosamente',
            file: {
                id: deletedFile.id,
                originalName: deletedFile.original_name,
                filename: deletedFile.filename
            },
            physicalFileDeleted: true
        });

    } catch (error) {
        console.error('Error eliminando archivo:', error);
        res.status(500).json({ 
            message: 'Error al eliminar archivo',
            error: error.message 
        });
    }
};

// LIST ALL FILES - GET /files/
const listFiles = async (req, res) => {
    try {
        const files = await File.getAllFiles();
        
        res.json({
            message: `${files.length} archivos encontrados`,
            files: files.map(file => ({
                id: file.id,
                originalName: file.original_name,
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size,
                uploadedAt: file.uploaded_at,
                productId: file.product_id,
                productName: file.product_name
            }))
        });

    } catch (error) {
        console.error('Error listando archivos:', error);
        res.status(500).json({ 
            message: 'Error al listar archivos',
            error: error.message 
        });
    }
};

// NEW - Upload Products with Files (Onboarding)
const uploadProductsWithFiles = async (req, res) => {
  try {
    console.log('📦 Recibiendo productos del onboarding...');
    console.log('Body keys:', Object.keys(req.body));
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    let productos = [];
    const archivosSubidos = [];

    // El frontend envía los productos de diferentes maneras
    if (req.body.productos) {
      // Si viene como array de objetos directamente
      if (Array.isArray(req.body.productos)) {
        productos = req.body.productos;
      } else {
        productos = [req.body.productos];
      }
    } else {
      // Si viene en formato productos[0][nombre], etc.
      const productosMap = {};
      
      for (const key in req.body) {
        console.log(`Procesando key: ${key} = ${req.body[key]}`);
        const match = key.match(/productos\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          
          if (!productosMap[index]) {
            productosMap[index] = {};
          }
          productosMap[index][field] = req.body[key];
          console.log(`Agregado: productos[${index}][${field}] = ${req.body[key]}`);
        }
      }

      // Convertir el mapa a array
      Object.keys(productosMap).forEach(index => {
        productos.push(productosMap[index]);
      });
    }

    console.log('✅ Productos parseados:', productos);

    // Procesar archivos si existen
    if (req.files && req.files.length > 0) {
      console.log(`📁 Procesando ${req.files.length} archivos...`);
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const producto = productos[i];
        
        if (file) {
          try {
            const fileData = {
              originalName: file.originalname,
              path: file.path,
              productId: null // Se puede buscar el producto en BD si es necesario
            };

            const savedFile = await File.saveFileInfo(fileData);

            archivosSubidos.push({
              nombre: file.originalname,
              filename: savedFile.name,
              producto: producto ? producto.nombre : 'Sin producto',
              fileId: savedFile.file_id
            });

            console.log(`✅ Archivo ${file.originalname} guardado${producto ? ` para producto ${producto.nombre}` : ''}`);
          } catch (fileError) {
            console.error(`❌ Error procesando archivo ${file.originalname}:`, fileError);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Productos y archivos procesados correctamente',
      data: {
        productos: productos,
        archivos: archivosSubidos,
        totalProductos: productos.length,
        totalArchivos: archivosSubidos.length
      }
    });

  } catch (error) {
    console.error('❌ Error en uploadProductsWithFiles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar productos y archivos',
      error: error.message
    });
  }
};

// NEW - Handle Tally Webhook
const handleTallyWebhook = async (req, res) => {
  try {
    console.log('🔗 Webhook de Tally recibido');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { eventType, data } = req.body;

    if (eventType === 'FORM_RESPONSE') {
      console.log('📝 Procesando respuesta de formulario Tally');
      
      const { responseId, formName, fields } = data;
      
      // Procesar campos del formulario
      const responseData = {};
      const attachments = [];

      fields.forEach(field => {
        const { key, label, type, value } = field;
        
        if (type === 'FILE_UPLOAD' && value && value.length > 0) {
          value.forEach(file => {
            attachments.push({
              fieldKey: key,
              fieldLabel: label,
              fileName: file.name,
              fileUrl: file.url,
              fileSize: file.size,
              mimeType: file.mimeType
            });
          });
        } else {
          responseData[key] = value;
        }
      });

      console.log('📊 Datos del formulario:', responseData);
      console.log('📎 Archivos adjuntos:', attachments);

      // Responder a Tally
      res.status(200).json({
        success: true,
        message: 'Webhook procesado correctamente',
        data: {
          responseId,
          formName,
          fieldsProcessed: Object.keys(responseData).length,
          filesProcessed: attachments.length
        }
      });

    } else {
      console.log(`ℹ️ Tipo de evento no manejado: ${eventType}`);
      res.status(200).json({
        success: true,
        message: 'Evento recibido pero no procesado'
      });
    }

  } catch (error) {
    console.error('❌ Error en handleTallyWebhook:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando webhook de Tally',
      error: error.message
    });
  }
};

// Funciones de compatibilidad con nombres diferentes
const getFiles = listFiles;
const downloadFile = downloadFileById;
const getFileByName = readFileByName;
const deleteFile = deleteFileByName;

module.exports = {
    uploadFile,
    uploadMultipleFiles,
    downloadFileById,
    readFileByName,
    deleteFileByName,
    listFiles,
    // Nuevas funciones
    uploadProductsWithFiles,
    handleTallyWebhook,
    // Alias para compatibilidad
    getFiles,
    downloadFile,
    getFileByName,
    deleteFile
}; 