const db = require('../config/db_pgsql'); // Configuracion de la BBDD
const User = require('../models/users.model'); // Modelo de usuario
const bcrypt = require('bcrypt'); // Libreria para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Libreria para generar tokens


// Validar JWT_SECRET
const getJWTSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET no está configurado en las variables de entorno');
    }
    if (secret.length < 32) {
        throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
    }
    return secret;
};

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
    const newUser = req.body; // { name, lastname, email, password, id_company }
    if (
        "name" in newUser &&
        "lastname" in newUser &&
        "email" in newUser &&
        "password" in newUser &&
        "id_company" in newUser
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

// Login user (usando base de datos real)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    try {
        // Buscar usuario en la base de datos
        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                name: user.name,
                id_company: user.id_company
            },
            getJWTSecret(),
            { expiresIn: '24h' }
        );

        // Remover password del objeto usuario antes de enviarlo
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Logout user
const logoutUser = async (req, res) => {
    try {
        // En un sistema JWT stateless, el logout se maneja desde el frontend
        // eliminando el token del localStorage
        res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Register user (usando base de datos real)
const registerUser = async (req, res) => {
    const newUser = req.body; // { name, lastname, email, password, id_company }
    
    if (!newUser.name || !newUser.lastname || !newUser.email || !newUser.password || !newUser.id_company) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    try {
        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await User.getUserByEmail(newUser.email);
        if (existingUser) {
            return res.status(409).json({ message: 'El usuario ya existe con ese email' });
        }

        // Encriptar la contraseña
        newUser.password = await bcrypt.hash(newUser.password, 10);
        const response = await User.createUser(newUser);

        // Obtener el usuario recién creado para generar el token
        const createdUser = await User.getUserByEmail(newUser.email);

        // Generar token JWT para el nuevo usuario
        const token = jwt.sign(
            { 
                id: createdUser.id,
                email: createdUser.email,
                name: createdUser.name,
                id_company: createdUser.id_company
            },
            getJWTSecret(),
            { expiresIn: '24h' }
        );

        // Remover password del objeto usuario antes de enviarlo
        const { password: _, ...userWithoutPassword } = createdUser;

        res.status(201).json({
            message: `Usuario registrado correctamente: ${createdUser.name}`,
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    loginUser,
    logoutUser,
    registerUser
}

