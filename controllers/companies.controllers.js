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
    const { url, company_name, products } = req.body; // Read from body instead of query

    if (!url || !company_name) {
      return res.status(400).json({
        success: false,
        message: 'URL y nombre de empresa son requeridos'
      });
    }

    // Para propósitos de demostración, crear productos de ejemplo si no se proporcionan
    let productList = products;
    if (!products || !Array.isArray(products) || products.length === 0) {
      console.log('🔄 Generando productos de ejemplo para:', company_name);
      
      // Generar nombres de productos más específicos según la empresa
      const getSpecificProducts = (companyName) => {
        const lowerCompany = companyName.toLowerCase();
        
        if (lowerCompany.includes('apple')) {
          return [
            { name: 'iPhone 15 Pro Eco', category: 'Electrónicos Sostenibles' },
            { name: 'MacBook Air Reciclado', category: 'Computadoras Verdes' },
            { name: 'iPad Carbon Neutral', category: 'Tablets Ecológicas' },
            { name: 'Apple Watch Green', category: 'Wearables Sostenibles' },
            { name: 'AirPods Recyclable', category: 'Audio Ecológico' },
            { name: 'Mac Studio Renewable', category: 'Computadoras Pro Verdes' }
          ];
        } else if (lowerCompany.includes('nike')) {
          return [
            { name: 'Air Max Solar', category: 'Calzado Sostenible' },
            { name: 'Dri-FIT Earth', category: 'Ropa Deportiva Eco' },
            { name: 'React Infinity Eco', category: 'Running Sostenible' },
            { name: 'Jordan Green Edition', category: 'Calzado Premium Eco' },
            { name: 'Nike Pro Recycled', category: 'Ropa Técnica Verde' }
          ];
        } else if (lowerCompany.includes('tesla')) {
          return [
            { name: 'Model Y Renewable', category: 'Vehículos Eléctricos' },
            { name: 'Solar Roof V4', category: 'Energía Solar' },
            { name: 'Model S Plaid Green', category: 'Vehículos Premium Eléctricos' },
            { name: 'Powerwall Eco', category: 'Almacenamiento Energético' },
            { name: 'Cybertruck Carbon Zero', category: 'Vehículos Comerciales Eléctricos' },
            { name: 'Tesla Bot Sustainable', category: 'Robótica Sostenible' }
          ];
        } else if (lowerCompany.includes('google')) {
          return [
            { name: 'Pixel Carbon Neutral', category: 'Dispositivos Sostenibles' },
            { name: 'Nest Eco Thermostat', category: 'Hogar Inteligente' },
            { name: 'Chromebook Green', category: 'Laptops Ecológicas' },
            { name: 'Google Home Recyclable', category: 'Asistentes Inteligentes Eco' },
            { name: 'Pixel Buds Sustainable', category: 'Audio Ecológico' }
          ];
        } else if (lowerCompany.includes('microsoft')) {
          return [
            { name: 'Surface Zero Waste', category: 'Hardware Sostenible' },
            { name: 'Azure Green Cloud', category: 'Servicios Cloud Eco' },
            { name: 'Xbox Series Green', category: 'Gaming Sostenible' },
            { name: 'HoloLens Eco Edition', category: 'Realidad Mixta Verde' },
            { name: 'Surface Pro Carbon Free', category: 'Tablets Pro Ecológicas' }
          ];
        } else if (lowerCompany.includes('nvidia')) {
          return [
            { name: 'GeForce RTX Green', category: 'Tarjetas Gráficas Eco' },
            { name: 'AI Compute Carbon-Free', category: 'Procesamiento IA Sostenible' },
            { name: 'Quadro Sustainable', category: 'GPUs Profesionales Verdes' },
            { name: 'Tesla V100 Eco', category: 'Computación Científica Verde' },
            { name: 'Jetson Green AI', category: 'IA Embebida Sostenible' }
          ];
        } else if (lowerCompany.includes('samsung')) {
          return [
            { name: 'Galaxy S24 Eco Edition', category: 'Smartphones Verdes' },
            { name: 'QLED Solar Powered', category: 'Pantallas Sostenibles' },
            { name: 'Galaxy Tab Green', category: 'Tablets Ecológicas' },
            { name: 'Galaxy Watch Carbon Zero', category: 'Wearables Sostenibles' },
            { name: 'Galaxy Buds Earth', category: 'Audio Ecológico' }
          ];
        } else if (lowerCompany.includes('amazon')) {
          return [
            { name: 'Echo Recycled Materials', category: 'Dispositivos Inteligentes' },
            { name: 'Kindle Zero Plastic', category: 'Lectores Electrónicos' },
            { name: 'Fire TV Eco Stick', category: 'Streaming Verde' },
            { name: 'Ring Doorbell Solar', category: 'Seguridad Sostenible' },
            { name: 'Alexa Green Edition', category: 'Asistentes IA Ecológicos' }
          ];
        } else if (lowerCompany.includes('ferrari')) {
          return [
            { name: `EcoSmart ${companyName}`, category: 'Productos Inteligentes' },
            { name: `${companyName} Carbon Zero`, category: 'Productos Carbono Neutral' },
            { name: `${companyName} Hybrid Performance`, category: 'Vehículos Híbridos Premium' },
            { name: `${companyName} Solar Edition`, category: 'Vehículos Energía Solar' },
            { name: `${companyName} Electric GT`, category: 'Deportivos Eléctricos' },
            { name: `${companyName} Sustainable Materials`, category: 'Componentes Ecológicos' }
          ];
        } else {
          // Productos genéricos pero más específicos para empresas desconocidas
          return [
            { name: `EcoSmart ${companyName}`, category: 'Productos Inteligentes' },
            { name: `${companyName} Carbon Zero`, category: 'Productos Carbono Neutral' },
            { name: `${companyName} Green Innovation`, category: 'Innovación Verde' },
            { name: `${companyName} Sustainable Pro`, category: 'Productos Profesionales Sostenibles' },
            { name: `${companyName} Eco Series`, category: 'Serie Ecológica' },
            { name: `${companyName} Planet Friendly`, category: 'Productos Amigables con el Planeta' }
          ];
        }
      };

      const specificProducts = getSpecificProducts(company_name);
      
      productList = specificProducts.map((prod, index) => {
        return {
          name: prod.name,
          carbon_footprint: Math.floor(Math.random() * 100 + 20).toString(),
          benchmark_percentage: Math.floor(Math.random() * 90 + 10).toString(),
          impact_score: Math.floor(Math.random() * 90 + 10),
          conclusion: `${prod.name} diseñado con tecnologías sostenibles y procesos eco-friendly`,
          raw_material: index === 0 ? 'Materiales reciclados y renovables' : 'Componentes orgánicos certificados',
          manufacturing: index === 0 ? 'Proceso de manufactura con energía 100% renovable' : 'Producción carbono neutral',
          transport: index === 0 ? 'Distribución optimizada con vehículos eléctricos' : 'Logística de corta distancia',
          packaging: index === 0 ? 'Empaque 100% reciclable y biodegradable' : 'Packaging sin plásticos',
          footprint_difference: '-' + Math.floor(Math.random() * 50 + 15) + '%',
          sustainability: index === 0 ? 'Muy Alta' : 'Alta',
          category: prod.category
        };
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
    
    // Procesar cada producto
    for (const productData of productList) {
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
        null // image
      ];

      const productResult = await db.query(queries.createProduct, productValues);
      createdProducts.push({
        ...productResult.rows[0],
        category: productData.category
      });
    }

    res.status(200).json({
      success: true,
      message: `${createdProducts.length} productos procesados exitosamente para ${company_name}`,
      data: {
        url,
        company: company,
        products: createdProducts,
        totalCreated: createdProducts.length
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

const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto requerido'
      });
    }

    // Obtener datos del producto de la base de datos
    const productResult = await db.query(queries.getProductDetailById, [id]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const product = productResult.rows[0];

    // Mockear datos adicionales basados en los campos de la BD
    const carbonFootprintTotal = parseFloat(product.carbon_footprint) || 5.78;
    const impactScore = product.impact_score || 85;
    const benchmarkPercentage = parseInt(product.benchmark_percentage) || 75;
    
    // Generar información de marketing específica según el producto
    let marketingInfo;
    const productName = product.name.toLowerCase();
    
    if (productName.includes('iphone')) {
      marketingInfo = {
        target_audience: 'Profesionales tech-savvy y early adopters 25-45 años',
        key_benefits: [
          'Diseño premium con materiales reciclados',
          '47% menos huella de carbono que generación anterior',
          'Chip A17 Pro ultra eficiente energéticamente',
          'Carga 100% con energía renovable en las instalaciones'
        ],
        sustainability_claims: [
          'Aluminio 100% reciclado en el chasis',
          'Embalaje libre de plástico',
          'Programa de trade-in para reciclaje',
          'Carbono neutral en operaciones globales'
        ],
        recommended_messaging: [
          'Innovación que cuida el planeta',
          'El futuro es sostenible y poderoso',
          'Tecnología premium, impacto mínimo',
          'Piensa diferente, actúa responsable'
        ],
        channels: ['Apple Store', 'E-commerce premium', 'Carriers', 'Retail autorizado'],
        price_positioning: 'Premium tecnológico sostenible'
      };
    } else if (productName.includes('air max') || productName.includes('nike')) {
      marketingInfo = {
        target_audience: 'Atletas conscientes y lifestyle urbano 18-35 años',
        key_benefits: [
          'Materiales reciclados en upper y suela',
          '35% menos emisiones vs modelos tradicionales',
          'Tecnología Air Max clásica renovada',
          'Producción con energía solar'
        ],
        sustainability_claims: [
          'Move to Zero: hacia cero carbono y desperdicio',
          'Poliéster 100% reciclado en el forro',
          'Suela con 15% de Nike Grind',
          'Certificación Cradle to Cradle'
        ],
        recommended_messaging: [
          'Just Do It, responsablemente',
          'Rendimiento sin comprometer el futuro',
          'Cada paso cuenta para el planeta',
          'Estilo icónico, impacto positivo'
        ],
        channels: ['Nike stores', 'Retailers deportivos', 'E-commerce', 'Sneaker boutiques'],
        price_positioning: 'Premium deportivo sostenible'
      };
    } else if (productName.includes('model y') || productName.includes('tesla')) {
      marketingInfo = {
        target_audience: 'Profesionales eco-conscientes y familias premium 30-55 años',
        key_benefits: [
          'Vehículo 100% eléctrico, cero emisiones directas',
          'Producción con energía renovable al 70%',
          'Materiales veganos y reciclados en interiores',
          'Red de Superchargers con energía solar'
        ],
        sustainability_claims: [
          'Líder en eficiencia energética SUV eléctricos',
          'Baterías reciclables al 95%',
          'Fábrica con certificación LEED Gold',
          'Programa de reciclaje de vehículos al final de vida'
        ],
        recommended_messaging: [
          'El futuro del transporte es hoy',
          'Acelera hacia un mundo sostenible',
          'Lujo eléctrico sin compromisos',
          'Innovación que transforma el mundo'
        ],
        channels: ['Tesla stores', 'Online direct sales', 'Showrooms', 'Test drive centers'],
        price_positioning: 'Lujo eléctrico accesible'
      };
    } else {
      // Información genérica para otros productos
      marketingInfo = {
        target_audience: 'Consumidores eco-conscientes 25-45 años',
        key_benefits: [
          'Producto certificado como sostenible',
          `${Math.abs(parseInt(product.footprint_difference || -35))}% menos huella que competencia`,
          'Materiales de origen responsable',
          'Proceso de fabricación optimizado'
        ],
        sustainability_claims: [
          'Certificado carbono neutro',
          'Materiales de comercio justo',
          'Proceso de manufactura limpia',
          'Embalaje biodegradable'
        ],
        recommended_messaging: [
          'Calidad que respeta el planeta',
          'Sostenibilidad sin sacrificar performance',
          'El futuro es responsable',
          'Elige consciente, elige mejor'
        ],
        channels: ['E-commerce', 'Retail sostenible', 'Tiendas especializadas'],
        price_positioning: 'Premium sostenible'
      };
    }
    
    // Generar datos mockeados inteligentes
    const mockedProductDetail = {
      id: product.id,
      name: product.name,
      company_name: product.company_name,
      model: `${product.name} Premium`,
      category: product.category || 'General',
      brand: product.company_name,
      link: 'www.devera.ai',
      impactScore: impactScore,
      scoreGrade: impactScore >= 80 ? 'A' : impactScore >= 60 ? 'B' : 'C',
      
      // Datos de base de datos
      carbon_footprint: product.carbon_footprint,
      benchmark_percentage: product.benchmark_percentage,
      impact_score: product.impact_score,
      conclusion: product.conclusion,
      raw_material: product.raw_material,
      manufacturing: product.manufacturing,
      transport: product.transport,
      packaging: product.packaging,
      footprint_difference: product.footprint_difference,
      sustainability: product.sustainability,
      image: product.image,
      
      // Datos mockeados para las vistas
      carbonFootprint: {
        total: carbonFootprintTotal,
        rawMaterials: carbonFootprintTotal * 0.26,
        manufacturing: carbonFootprintTotal * 0.14,
        transport: carbonFootprintTotal * 0.21,
        packaging: carbonFootprintTotal * 0.36,
        use: 0.00,
        endOfLife: carbonFootprintTotal * 0.03
      },
      
      sustainabilityScore: impactScore,
      brandFootprint: (impactScore / 10).toFixed(1),
      brandSustainability: ((impactScore - 3) / 10).toFixed(1),
      averageFootprint: (carbonFootprintTotal * 1.67).toFixed(2),
      footprintDifference: product.footprint_difference || `-${Math.floor(Math.random() * 50 + 20)}`,
      
      // Conclusiones mockeadas
      conclusions: {
        summary: product.conclusion || 'Producto con impacto ambiental positivo según análisis.',
        strengths: [
          'Uso de materiales renovables en un 65%',
          'Proceso de fabricación optimizado energéticamente',
          'Embalaje 100% reciclable',
          'Huella de carbono por debajo del promedio del sector'
        ],
        improvements: [
          'Reducir emisiones en transporte usando vehículos eléctricos',
          'Incrementar uso de energías renovables en fabricación',
          'Optimizar cadena de suministro local'
        ],
        certifications: ['ISO 14001', 'Carbon Trust', 'FSC Certified'],
        environmental_impact: 'Impacto ambiental BAJO - Producto recomendado'
      },
      
      // Detalle por categorías
      categories: {
        materials: {
          score: Math.floor(impactScore * 0.9),
          details: product.raw_material || 'Materiales sostenibles de origen renovable',
          percentage_renewable: '65%',
          certifications: ['FSC', 'PEFC']
        },
        manufacturing: {
          score: Math.floor(impactScore * 0.85),
          details: product.manufacturing || 'Proceso eficiente con energía solar',
          energy_renewable: '78%',
          water_efficiency: '85%'
        },
        transport: {
          score: Math.floor(impactScore * 0.75),
          details: product.transport || 'Logística optimizada con rutas eficientes',
          local_suppliers: '60%',
          carbon_efficient: true
        },
        packaging: {
          score: Math.floor(impactScore * 0.95),
          details: product.packaging || 'Embalaje minimalista y reciclable',
          recyclable: '100%',
          biodegradable: '85%'
        }
      },
      
      // Comparativa con la competencia
      comparison: {
        market_position: 'Superior',
        competitors: [
          { name: 'Competidor A', footprint: carbonFootprintTotal * 1.4, score: impactScore - 15 },
          { name: 'Competidor B', footprint: carbonFootprintTotal * 1.8, score: impactScore - 22 },
          { name: 'Competidor C', footprint: carbonFootprintTotal * 1.2, score: impactScore - 8 }
        ],
        industry_average: (carbonFootprintTotal * 1.67).toFixed(2),
        ranking: '2° de 15 productos similares'
      },
      
      // Sostenibilidad de marca
      brand_sustainability: {
        overall_score: parseFloat(((impactScore - 3) / 10).toFixed(1)),
        initiatives: [
          'Programa de reforestación - 1000 árboles/año',
          'Uso 100% energía renovable en oficinas',
          'Certificación B-Corp desde 2022',
          'Plan Net Zero para 2030'
        ],
        social_impact: {
          fair_trade: true,
          local_communities: 'Apoyo a 15 comunidades locales',
          employee_satisfaction: '4.8/5'
        },
        transparency: {
          supply_chain_visibility: '95%',
          impact_reporting: 'Anual',
          third_party_audits: true
        }
      },
      
      // Información de marketing específica por producto
      marketing_info: marketingInfo
    };

    res.status(200).json({
      success: true,
      data: mockedProductDetail
    });

  } catch (error) {
    console.error('Error al obtener detalle del producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const getAllProductsBasic = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    // Obtener productos con información de compañía
    const result = await db.query(queries.getAllProductsWithCompany, [parseInt(limit), parseInt(offset)]);

    // Obtener el total para paginación
    const countResult = await db.query(queries.getProductsCount);
    const total = parseInt(countResult.rows[0].total);

    // Transformar datos para frontend
    const products = result.rows.map(product => ({
      id: product.id,
      name: product.name,
      company: product.company_name || 'Sin empresa',
      category: product.category || 'Sin categoría',
      impactScore: product.impact_score || Math.floor(Math.random() * 40 + 60),
      scoreGrade: product.impact_score >= 80 ? 'A' : product.impact_score >= 60 ? 'B' : 'C',
      carbonFootprint: parseFloat(product.carbon_footprint) || (Math.random() * 10 + 2).toFixed(2),
      sustainability: product.sustainability || 'Media',
      image: 'https://via.placeholder.com/150x150/4ade80/ffffff?text=Producto'
    }));

    res.status(200).json({
      success: true,
      data: {
        products: products,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Generate Product Report
 * POST /generate_product_report
 */
const generateProductReport = async (req, res) => {
  try {
    const { product_data, analysis_type = 'sustainability' } = req.body;

    if (!product_data) {
      return res.status(400).json({
        success: false,
        message: 'Datos del producto requeridos'
      });
    }

    // Simular generación de reporte con IA
    const report = {
      product_name: product_data.name || 'Producto sin nombre',
      analysis_type: analysis_type,
      generated_at: new Date().toISOString(),
      report_id: `RPT-${Date.now()}`,
      
      sustainability_analysis: {
        overall_score: Math.floor(Math.random() * 40 + 60), // 60-100
        carbon_footprint: (Math.random() * 50 + 10).toFixed(2), // 10-60 kg CO2
        environmental_impact: 'MEDIO',
        certifications: ['ISO 14001', 'Carbon Trust'],
        
        breakdown: {
          materials: {
            score: Math.floor(Math.random() * 30 + 70),
            description: 'Uso de materiales renovables y reciclados',
            recommendations: [
              'Incrementar uso de materiales reciclados',
              'Certificar origen sostenible de materias primas'
            ]
          },
          production: {
            score: Math.floor(Math.random() * 25 + 75),
            description: 'Proceso productivo eficiente energéticamente',
            recommendations: [
              'Implementar energías renovables',
              'Optimizar cadena de suministro'
            ]
          },
          packaging: {
            score: Math.floor(Math.random() * 20 + 80),
            description: 'Embalaje minimalista y reciclable',
            recommendations: [
              'Reducir uso de plásticos',
              'Implementar packaging compostable'
            ]
          },
          transport: {
            score: Math.floor(Math.random() * 35 + 65),
            description: 'Logística con oportunidades de mejora',
            recommendations: [
              'Optimizar rutas de distribución',
              'Usar transporte eléctrico'
            ]
          }
        }
      },
      
      market_analysis: {
        competitive_position: 'STRONG',
        market_trends: [
          'Creciente demanda por productos sostenibles',
          'Regulaciones ambientales más estrictas',
          'Consumidores dispuestos a pagar premium verde'
        ],
        opportunities: [
          'Certificaciones adicionales',
          'Marketing de sostenibilidad',
          'Alianzas con ONGs ambientales'
        ]
      },
      
      recommendations: {
        short_term: [
          'Implementar sistema de medición de huella de carbono',
          'Obtener certificaciones ambientales básicas',
          'Comunicar beneficios sostenibles existentes'
        ],
        medium_term: [
          'Rediseñar packaging con materiales sostenibles',
          'Optimizar cadena de suministro',
          'Implementar programa de reciclaje'
        ],
        long_term: [
          'Alcanzar neutralidad de carbono',
          'Certificación B-Corp',
          'Liderazgo en sostenibilidad del sector'
        ]
      },
      
      ai_insights: {
        confidence_level: 'HIGH',
        data_quality: 'GOOD',
        model_version: 'v2.1.0',
        processing_time: `${(Math.random() * 3 + 1).toFixed(1)}s`
      }
    };

    res.status(200).json({
      success: true,
      message: 'Reporte generado exitosamente',
      data: report
    });

  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte',
      error: error.message
    });
  }
};

/**
 * Download All Products CSV
 * GET /csv/all-products
 */
const downloadAllProductsCSV = async (req, res) => {
  try {
    // Obtener todos los productos con información de empresa
    const productsResult = await db.query(queries.getAllProductsWithCompanyForCSV);

    const products = productsResult.rows;

    // Generar CSV
    const csvHeader = 'ID,Nombre,Empresa,Categoría,Huella de Carbono,Puntuación de Impacto,Sostenibilidad,Conclusión,Materias Primas,Manufactura,Transporte,Empaque,Diferencia de Huella,Fecha de Creación\n';
    
    const csvRows = products.map(product => {
      return [
        product.id,
        `"${product.name || ''}"`,
        `"${product.company_name || ''}"`,
        `"${product.category || ''}"`,
        product.carbon_footprint || '',
        product.impact_score || '',
        `"${product.sustainability || ''}"`,
        `"${(product.conclusion || '').replace(/"/g, '""')}"`,
        `"${(product.raw_material || '').replace(/"/g, '""')}"`,
        `"${(product.manufacturing || '').replace(/"/g, '""')}"`,
        `"${(product.transport || '').replace(/"/g, '""')}"`,
        `"${(product.packaging || '').replace(/"/g, '""')}"`,
        `"${product.footprint_difference || ''}"`,
        new Date().toISOString().split('T')[0]
      ].join(',');
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="todos_los_productos_${new Date().toISOString().split('T')[0]}.csv"`);
    
    res.status(200).send('\ufeff' + csvContent); // BOM para UTF-8

  } catch (error) {
    console.error('Error al generar CSV de todos los productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar archivo CSV',
      error: error.message
    });
  }
};

/**
 * Download Company CSV
 * GET /csv/{nombre_empresa}
 */
const downloadCompanyCSV = async (req, res) => {
  try {
    const { nombre_empresa } = req.params;
    
    if (!nombre_empresa) {
      return res.status(400).json({
        success: false,
        message: 'Nombre de empresa requerido'
      });
    }

    // Obtener productos de la empresa específica
    const result = await db.query(queries.getProductsByCompanyForCSV, [nombre_empresa]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron productos para la empresa: ${nombre_empresa}`
      });
    }

    // Generar CSV
    const csvData = generateCSVFromProducts(result.rows);
    
    // Configurar headers para descarga
    const filename = `productos_${nombre_empresa.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    
    res.send(csvData);
    
  } catch (error) {
    console.error('Error generando CSV de empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error generando archivo CSV',
      error: error.message
    });
  }
};

// CLEANUP DATABASE - DELETE ALL DATA
const cleanupDatabase = async (req, res) => {
  try {
    console.log('🧹 Iniciando limpieza de base de datos...');
    
    // Eliminar todos los productos
    const productsResult = await db.query(queries.deleteAllProducts);
    console.log(`✅ ${productsResult.rowCount} productos eliminados`);
    
    // Eliminar todas las empresas (manteniendo las primeras 6)
    const companiesResult = await db.query(queries.deleteAllCompanies);
    console.log(`✅ ${companiesResult.rowCount} empresas eliminadas`);
    
    // Eliminar todos los archivos
    const filesResult = await db.query(queries.deleteAllFiles);
    console.log(`✅ ${filesResult.rowCount} archivos eliminados`);
    
    res.status(200).json({
      success: true,
      message: 'Base de datos limpiada exitosamente',
      data: {
        productos_eliminados: productsResult.rowCount,
        empresas_eliminadas: companiesResult.rowCount,
        archivos_eliminados: filesResult.rowCount
      }
    });
    
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error limpiando base de datos',
      error: error.message
    });
  }
};

module.exports = {
  createCompany,
  getTableContent,
  scrapeAndUploadProducts,
  processFile,
  getProductDetail,
  getAllProductsBasic,
  generateProductReport,
  downloadAllProductsCSV,
  downloadCompanyCSV,
  cleanupDatabase
}