const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/users.controllers');

//Obtener todos los usuarios
router.get('/', usersControllers.getAllUsers);

//OBTENER USUARIO POR ID
router.get('/id/:id', usersControllers.getUserById);

//OBTENER USUARIO POR EMAIL
router.get('/email/:email', usersControllers.getUserByEmail);

//CREAR USUARIO
router.post('/', usersControllers.createUser);

module.exports = router;