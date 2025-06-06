const express = require('express');
const router = express.Router();
const companiesController = require('../controllers/companies.controllers');

router.post('/', companiesController.createCompany);
router.post('/scrape_and_upload_products', companiesController.scrapeAndUploadProducts);
router.get('/process_file/:file_id', companiesController.processFile);

module.exports = router;
