const queries = {
    //USERS

    getAllUsers: `SELECT * FROM users;`,
    getUserById: `SELECT * FROM users WHERE id = $1`,
    getUserByEmail: `SELECT * FROM users WHERE email = $1`,
    createUser: `INSERT INTO users (name, lastname, email, password, created_at, id_empresa)
                 VALUES ($1, $2, $3, $4, NOW(), $5)
                 RETURNING *`,

    //PRODUCTS
    getAllProducts: `SELECT * FROM products;`,
    getProductById: `SELECT * FROM products WHERE id = $1`,
}

module.exports = queries;
