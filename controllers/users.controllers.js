const db = require('../config/db_pgsql'); // Configuracion de la BBDD
const User = require('../models/users.model'); // Modelo de usuario
const bcrypt = require('bcrypt'); // Libreria para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Libreria para generar tokens

module.exports = {}