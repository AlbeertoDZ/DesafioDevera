const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/users.controllers');

//RUTA DE PRUEBA
router.get('/test', (req, res) => {
    res.json({ message: 'API funcionando correctamente', timestamp: new Date().toISOString() });
});

//Obtener todos los usuarios
router.get('/', usersControllers.getAllUsers);

//OBTENER USUARIO POR ID
router.get('/id/:id', usersControllers.getUserById);

//OBTENER USUARIO POR EMAIL
router.get('/email/:email', usersControllers.getUserByEmail);

//CREAR USUARIO
router.post('/', usersControllers.createUser);

//LOGIN
router.post('/login', usersControllers.loginUser);

//LOGOUT
router.post('/logout', usersControllers.logoutUser);

//REGISTER (ALIAS PARA CREAR USUARIO)
router.post('/register', usersControllers.registerUser);

module.exports = router;