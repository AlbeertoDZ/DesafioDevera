const express = require('express');
const router = express.Router();
const filesControllers = require('../controllers/files.controllers');

// RUTA DE PRUEBA
router.get('/test', (req, res) => {
    res.json({ 
        message: 'API de archivos funcionando correctamente', 
        timestamp: new Date().toISOString() 
    });
});

// POST /upload/ - Upload Files
router.post('/upload/', filesControllers.uploadFile);

// POST /upload-multiple/ - Upload Multiple Files  
router.post('/upload-multiple/', filesControllers.uploadMultipleFiles);

// GET /files/ - List Files
router.get('/files/', filesControllers.listFiles);

// GET /files/{file_id} - Download File
router.get('/files/:file_id', filesControllers.downloadFileById);

// GET /files/{file_name} - Read File
router.get('/files/name/:file_name', filesControllers.readFileByName);

// DELETE /files/{file_name} - Delete File
router.delete('/files/:file_name', filesControllers.deleteFileByName);

module.exports = router; 