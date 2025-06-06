const express = require('express');
const router = express.Router();
const filesControllers = require('../controllers/files.controllers');
const upload = require('../middleware/multer');

// RUTA DE PRUEBA
router.get('/test', (req, res) => {
    res.json({ 
        message: 'API de archivos funcionando correctamente', 
        timestamp: new Date().toISOString() 
    });
});

// POST /upload/ - Upload Files
router.post('/upload/', upload.single('file'), filesControllers.uploadFile);

// POST /upload-multiple/ - Upload Multiple Files  
router.post('/upload-multiple/', upload.array('files', 10), filesControllers.uploadMultipleFiles);

// GET /files/ - List Files
router.get('/files/', filesControllers.getFiles);

// GET /files/{file_id} - Download File
router.get('/files/:file_id', filesControllers.downloadFile);

// GET /files/{file_name} - Read File
router.get('/files/name/:file_name', filesControllers.getFileByName);

// DELETE /files/{file_name} - Delete File
router.delete('/files/name/:file_name', filesControllers.deleteFile);

// NEW - Subir productos con archivos (Onboarding)
router.post('/files/subir-productos', upload.array('archivos'), filesControllers.uploadProductsWithFiles);

// NEW - Webhook de Tally
router.post('/files/tally-webhook', filesControllers.handleTallyWebhook);

module.exports = router; 