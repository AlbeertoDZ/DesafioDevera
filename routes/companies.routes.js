const express = require('express');
const router = express.Router();
const companiesController = require('../controllers/companies.controllers');

router.post('/', companiesController.createCompany);

module.exports = router;
