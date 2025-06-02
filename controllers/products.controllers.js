const Product = require('../models/products.model');

//Get all products
const getAllProducts = async (req,res) => {
    try {
        const products = await Product.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los productos'});
    }
}

//Get products by ID
const getProductById = async (req,res) => {
    const {id} = req.params; 
    try {
        const product = await Product.getProductbyId(id);
        if(!product){
            return res.status(404).json({message:'Producto no encontrado'})
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener el producto'});
    }
}

//Create product
const createProduct = async (req,res) => {
    const newProduct = req.body; //{name, id_company, carbon_footprint, benchmark_percentage, impact_score}
    if (
        "name" in newProduct &&
        "id_company" in newProduct &&
        "carbon_footprint" in newProduct &&
        "benchmark_percentage" in newProduct &&
        "impact_score" in newProduct
    )
    try {
        const response = await Product.createProduct(newProduct);

        res.status(201).json({
            message:`Producto creado: ${newProduct.name}`,
            items_created: response,
            data: newProduct
        })

    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto' });
    }
    else {
        res.status(400).json({ message: 'Faltan campos de entrada' });
    }
}


module.exports = {
    getAllProducts,
    getProductById,
    createProduct
}