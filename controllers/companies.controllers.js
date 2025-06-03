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

module.exports = {
  createCompany,
  getTableContent
}