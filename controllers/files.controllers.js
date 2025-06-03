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

module.exports = {
    uploadFile,
    uploadMultipleFiles,
    downloadFileById,
    readFileByName,
    deleteFileByName,
    listFiles
}; 