const db = require('../config/db_pgsql');
const Company = require('../models/companies.model');
const queries = require('../queries/queries');

/**
 * Crear una nueva empresa
 * POST /companies/
 */
const createCompany = async (req, res) => {
  try {
    const { 
      name,
      employees,
      sustainability_report,
      renewable_sources_percentage,
      carbon_footprint_plan,
      non_renewable_matter_percentage,
      distance_less_400_percentage,
      social_projects,
      sustainability_criticism,
      equality_plan,
      wage_gap_gen,
      conciliation_measures,
      enps,
      relevant_inf
    } = req.body;

    // Validar campos requeridos
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la empresa es requerido'
      });
    }

    const values = [
      name, employees, sustainability_report, renewable_sources_percentage,
      carbon_footprint_plan, non_renewable_matter_percentage, distance_less_400_percentage,
      social_projects, sustainability_criticism, equality_plan, wage_gap_gen,
      conciliation_measures, enps, relevant_inf
    ];

    const result = await db.query(queries.createCompany, values);
    const newCompany = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Empresa creada exitosamente',
      data: newCompany
    });

  } catch (error) {
    console.error('Error al crear empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtener contenido de una tabla específica
 * GET /tables/{table_name}
 */
const getTableContent = async (req, res) => {
  try {
    const { table_name } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    // Lista de tablas permitidas por seguridad
    const allowedTables = ['companies', 'products', 'users', 'files'];
    
    if (!allowedTables.includes(table_name)) {
      return res.status(400).json({
        success: false,
        message: 'Tabla no permitida o no existe'
      });
    }

    let query, countQuery;
    
    if (table_name === 'files') {
      query = queries.getTableContent.replace('{table_name}', table_name);
      countQuery = queries.getTableCount.replace('{table_name}', table_name);
    } else {
      query = queries.getTableContentWithId.replace('{table_name}', table_name);
      countQuery = queries.getTableCount.replace('{table_name}', table_name);
    }

    const values = [parseInt(limit), parseInt(offset)];
    const result = await db.query(query, values);

    // Obtener el total de registros para paginación
    const countResult = await db.query(countQuery);
    const total = parseInt(countResult.rows[0].total);

    res.status(200).json({
      success: true,
      data: {
        table: table_name,
        records: result.rows,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener contenido de tabla:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const scrapeAndUploadProducts = async (req, res) => {
  try {
    const { url, company_name } = req.query;
    const { products } = req.body; // Productos ya procesados por el agente de IA

    if (!url || !company_name) {
      return res.status(400).json({
        success: false,
        message: 'URL y nombre de empresa son requeridos'
      });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de productos procesados por el agente de IA'
      });
    }

    // Buscar o crear la empresa
    let company;
    const companyResult = await db.query(queries.getCompanyByName, [company_name]);
    
    if (companyResult.rows.length === 0) {
      const newCompanyResult = await db.query(queries.createCompanyBasic, [company_name]);
      company = newCompanyResult.rows[0];
    } else {
      company = companyResult.rows[0];
    }

    const createdProducts = [];
    
    // Procesar cada producto enviado por el agente de IA
    for (const productData of products) {
      const productValues = [
        productData.name || `Producto de ${url}`,
        company.id,
        productData.carbon_footprint || '0',
        productData.benchmark_percentage || '0',
        productData.impact_score || 0,
        productData.conclusion || 'Producto procesado por agente de IA',
        productData.raw_material || 'No especificado',
        productData.manufacturing || 'No especificado',
        productData.transport || 'No especificado',
        productData.packaging || 'No especificado',
        productData.footprint_difference || '0%',
        productData.sustainability || 'No evaluado',
        productData.image || null
      ];

      const productResult = await db.query(queries.createProduct, productValues);
      createdProducts.push(productResult.rows[0]);
    }

    res.status(200).json({
      success: true,
      message: `${createdProducts.length} productos procesados exitosamente para ${company_name}`,
      data: {
        url,
        company: company,
        products: createdProducts
      }
    });

  } catch (error) {
    console.error('Error en scraping:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el proceso de scraping',
      error: error.message
    });
  }
};

const processFile = async (req, res) => {
  try {
    const { file_id } = req.params;

    if (!file_id) {
      return res.status(400).json({
        success: false,
        message: 'ID de archivo requerido'
      });
    }

    // Obtener información del archivo
    const fileResult = await db.query(queries.getFileById, [file_id]);
    
    if (fileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    const file = fileResult.rows[0];
    const productId = file.product_id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'El archivo no tiene un producto asociado'
      });
    }

    // Simular procesamiento del archivo y actualización del producto
    const updatedProductData = [
      productId,
      `${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 100)}`, // carbon_footprint
      Math.floor(Math.random() * 100).toString(), // benchmark_percentage
      Math.floor(Math.random() * 100), // impact_score
      'Datos actualizados desde archivo procesado', // conclusion
      'Material analizado desde archivo', // raw_material
      'Proceso de manufactura actualizado', // manufacturing
      'Transporte optimizado post-análisis', // transport
      'Empaque mejorado', // packaging
      `${Math.floor(Math.random() * 30)}% mejora`, // footprint_difference
      'Muy alta', // sustainability
      null // image (esta columna SÍ existe en products)
    ];

    const updateResult = await db.query(queries.updateProduct, updatedProductData);
    
    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado para actualizar'
      });
    }

    res.status(200).json({
      success: true,
      message: `Archivo ${file_id} procesado y datos del producto ${productId} actualizados.`,
      data: {
        file: {
          id: file.id,
          name: file.original_name,
          product_id: productId
        },
        product: updateResult.rows[0]
      }
    });

  } catch (error) {
    console.error('Error al procesar archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar archivo',
      error: error.message
    });
  }
};

module.exports = {
  createCompany,
  getTableContent,
  scrapeAndUploadProducts,
  processFile
}