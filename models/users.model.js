const pool = require('../config/db_pgsql'); // Configuracion de la BBDD
const queries = require('../queries/queries') // Consultas SQL

//GET ALL USERS
const getAllUsers = async () => {
    let client, result;
    try {
        client = await pool.connect(); 
        const data = await client.query(queries.getAllUsers); 
        result = data.rows; 
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
    return result;
}

//GET USER BY ID
const getUserById = async (id) => {
    let client, result;
    try {
        client = await pool.connect(); 
        const data = await client.query(queries.getUserById, [id]); 
        result = data.rows[0]; 
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
    return result;
};

//GET USER BY EMAIL
const getUserByEmail = async (email) => {
    let client, result;
    try {
        client = await pool.connect(); 
        const data = await client.query(queries.getUserByEmail, [email]); 
        result = data.rows[0]; 
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
    return result;
};

//CREATE USER
const createUser = async (user) => {
    const { name, lastname, email, password, id_company } = user;
    let client, result;
    if (!name || !lastname || !email || !password || !id_company) {
        throw new Error('Todos los campos son obligatorios');
    }
    try {
        client = await pool.connect();
        const data = await client.query(queries.createUser, [
            name,
            lastname,
            email,
            password,
            id_company
        ]);
        result = data.rowCount
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
    return result
};


module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser
}

