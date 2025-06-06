const pool = require('../config/db_pgsql'); // Configuracion de la BBDD
const queries = require('../queries/queries') // Consultas SQL

//GET ALL PRODUCTS
const getAllProducts = async () => {
    let client, result;
    try {
        client = await pool.connect(); 
        const data = await client.query(queries.getAllProducts); 
        result = data.rows; 
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
    return result;
}

//GET PRODUCT BY ID
const getProductbyId = async (id) => {
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(queries.getProductsbyId, [id]);
        result = data.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
}

//POST
const createProduct = async (product) => {
    const {name, id_company, carbon_footprint, benchmark_percentage, impact_score} = product;
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(queries.createProduct, [
            name,
            id_company,
            carbon_footprint,
            benchmark_percentage,
            impact_score
        ]);
        result = data.rowCount

    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
    return result;
}


module.exports = {
    getAllProducts,
    getProductbyId,
    createProduct
}