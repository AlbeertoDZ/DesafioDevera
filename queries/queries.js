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

    //FILES
    saveFileInfo: `INSERT INTO files (name, product_id, content, created_at, image)
                   VALUES ($1, $2, $3, NOW(), $4)
                   RETURNING *`,
    
    getAllFiles: `SELECT f.file_id as id, f.name as original_name, f.name as filename,
                         'application/octet-stream' as mimetype,
                         length(f.content) as size, f.created_at as uploaded_at,
                         f.product_id, f.image,
                         p.name as product_name
                  FROM files f 
                  LEFT JOIN products p ON f.product_id = p.id 
                  ORDER BY f.created_at DESC`,
    
    getFileById: `SELECT f.file_id as id, f.name as original_name, f.name as filename,
                         'application/octet-stream' as mimetype,
                         length(f.content) as size, f.created_at as uploaded_at,
                         f.product_id, f.image, f.content,
                         p.name as product_name
                  FROM files f 
                  LEFT JOIN products p ON f.product_id = p.id 
                  WHERE f.file_id = $1`,
    
    getFileByName: `SELECT f.file_id as id, f.name as original_name, f.name as filename,
                           'application/octet-stream' as mimetype,
                           length(f.content) as size, f.created_at as uploaded_at,
                           f.product_id, f.image, f.content,
                           p.name as product_name
                    FROM files f 
                    LEFT JOIN products p ON f.product_id = p.id 
                    WHERE f.name = $1 OR f.image = $1`,
    
    deleteFile: `DELETE FROM files WHERE name = $1 OR image = $1 RETURNING *`
}

module.exports = queries;
