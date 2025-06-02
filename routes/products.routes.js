const express = require('express');
const router = express.Router();
const productsControllers = require('../controllers/products.controllers');

//Obtener todos los productos
router.get('/', productsControllers.getAllProducts);

//Obtener producto por id
router.get('/id/:id', productsControllers.getProductById);

//Crear Producto
router.post('/', productsControllers.createProduct);

module.exports = router;