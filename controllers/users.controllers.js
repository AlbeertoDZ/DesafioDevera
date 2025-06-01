const db = require('../config/db_pgsql'); // Configuracion de la BBDD
const User = require('../models/users.model'); // Modelo de usuario
const bcrypt = require('bcrypt'); // Libreria para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Libreria para generar tokens

//Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
}

// Get user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
}

// Get user by email
const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
}

// Create user
const createUser = async (req, res) => {
    const newUser = req.body; // { name, lastname, email, password, id_empresa }
    if (
        "name" in newUser &&
        "lastname" in newUser &&
        "email" in newUser &&
        "password" in newUser &&
        "id_empresa" in newUser
    )
        try {
            //Encriptar la contraseña
            newUser.password = await bcrypt.hash(newUser.password, 10);
            const response = await User.createUser(newUser);

            res.status(201).json({
                message: `Usuario creado correctamente: ${newUser.name}`,
                items_creates: response,
                data: newUser
            });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({ error: 'Error al crear usuario' });
        }
    else {
        res.status(400).json({ message: "Faltan campos en la entrada" });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser
}