const Product = require('../models/products.model');
const db = require('../config/db_pgsql');
const queries = require('../queries/queries');

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
        res.status(200).json(product);
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

//Update product
const updateProduct = async (req, res) => {
    try {
        const { product_id } = req.params;
        const updateData = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: 'ID de producto requerido'
            });
        }

        // Verificar que el producto existe
        const existingProduct = await db.query(queries.getProductById, [product_id]);
        if (existingProduct.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        // Preparar datos para actualización
        const {
            carbon_footprint,
            benchmark_percentage,
            impact_score,
            conclusion,
            raw_material,
            manufacturing,
            transport,
            packaging,
            footprint_difference,
            sustainability,
            image
        } = updateData;

        const updateValues = [
            product_id,
            carbon_footprint || existingProduct.rows[0].carbon_footprint,
            benchmark_percentage || existingProduct.rows[0].benchmark_percentage,
            impact_score || existingProduct.rows[0].impact_score,
            conclusion || existingProduct.rows[0].conclusion,
            raw_material || existingProduct.rows[0].raw_material,
            manufacturing || existingProduct.rows[0].manufacturing,
            transport || existingProduct.rows[0].transport,
            packaging || existingProduct.rows[0].packaging,
            footprint_difference || existingProduct.rows[0].footprint_difference,
            sustainability || existingProduct.rows[0].sustainability,
            image || existingProduct.rows[0].image
        ];

        const result = await db.query(queries.updateProduct, updateValues);

        if (result.rows.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el producto'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct
}