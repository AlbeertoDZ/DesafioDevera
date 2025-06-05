const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multer');
const { 
  uploadFile, 
  uploadMultipleFiles, 
  getFiles, 
  downloadFile, 
  getFileByName, 
  deleteFile,
  uploadProductsWithFiles,
  handleTallyWebhook
} = require('../controllers/files.controllers');

// Existing routes...
router.post('/upload/', upload.single('file'), uploadFile);
router.post('/upload-multiple/', upload.array('files', 10), uploadMultipleFiles);
router.get('/', getFiles);
router.get('/:file_id', downloadFile);
router.get('/name/:file_name', getFileByName);
router.delete('/name/:file_name', deleteFile);

// New route for onboarding products with files
router.post('/subir-productos', upload.array('archivos'), uploadProductsWithFiles);

// Webhook endpoint for Tally form submissions
router.post('/tally-webhook', handleTallyWebhook);

module.exports = router; 