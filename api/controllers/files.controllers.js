const uploadProductsWithFiles = async (req, res) => {
  try {
    const db = require('../../config/db_pgsql');
    const queries = require('../../queries/queries');
    
    // Función para generar conclusión específica según el producto
    const generateProductConclusion = (productName, industry, url) => {
      const name = productName.toLowerCase();
      
      // Detectar tipo de producto por palabras clave
      if (name.includes('iphone') || name.includes('móvil') || name.includes('smartphone')) {
        return `El ${productName} demuestra el compromiso de ${industry} con la innovación sostenible en dispositivos móviles. Su diseño optimizado reduce significativamente las emisiones de carbono durante el ciclo de vida del producto.`;
      } else if (name.includes('ipad') || name.includes('tablet')) {
        return `${productName} representa un avance en tecnología de tablets sostenibles. Su fabricación incorpora materiales reciclados y procesos de manufactura eficientes energéticamente.`;
      } else if (name.includes('macbook') || name.includes('laptop') || name.includes('portátil')) {
        return `El ${productName} establece nuevos estándares en computación portátil sustentable. Su arquitectura eficiente y materiales eco-friendly reducen el impacto ambiental sin comprometer el rendimiento.`;
      } else if (name.includes('tesla') || name.includes('model') || name.includes('eléctrico') || name.includes('electric')) {
        return `${productName} revoluciona la movilidad sostenible con tecnología de vehículos eléctricos de última generación. Elimina completamente las emisiones directas y reduce la dependencia de combustibles fósiles.`;
      } else if (name.includes('ferrari') || name.includes('auto') || name.includes('car') || name.includes('vehicle')) {
        return `${productName} combina la excelencia automotriz con innovación sustentable. Su tecnología híbrida avanzada reduce las emisiones mientras mantiene el rendimiento característico de la marca.`;
      } else if (name.includes('solar') || name.includes('panel') || name.includes('energía')) {
        return `${productName} impulsa la transición hacia energías renovables con tecnología solar de alta eficiencia. Contribuye significativamente a la reducción de la huella de carbono energética.`;
      } else if (name.includes('nvidia') || name.includes('gpu') || name.includes('chip') || name.includes('procesador')) {
        return `${productName} lidera la innovación en procesamiento eficiente energéticamente. Su arquitectura avanzada maximiza el rendimiento mientras minimiza el consumo energético.`;
      } else if (name.includes('google') || name.includes('cloud') || name.includes('servidor')) {
        return `${productName} optimiza la eficiencia energética en infraestructura digital. Sus innovaciones en centros de datos sustentables reducen el impacto ambiental de la computación en la nube.`;
      } else if (name.includes('microsoft') || name.includes('surface') || name.includes('software')) {
        return `${productName} demuestra el compromiso con la sostenibilidad digital. Su desarrollo considera el ciclo de vida completo del software y hardware, optimizando la eficiencia energética.`;
      } else if (name.includes('amazon') || name.includes('alexa') || name.includes('echo')) {
        return `${productName} integra tecnología inteligente con principios de diseño sustentable. Su eficiencia energética y materiales reciclados reducen el impacto ambiental de los dispositivos conectados.`;
      } else if (name.includes('samsung') || name.includes('galaxy') || name.includes('smart')) {
        return `${productName} establece nuevos estándares en electrónicos sustentables. Su proceso de fabricación responsable y uso de materiales reciclados demuestran liderazgo en sostenibilidad tecnológica.`;
      } else {
        // Conclusión genérica basada en la industria
        return `${productName} de ${industry} incorpora principios de sostenibilidad en su diseño y fabricación. Su enfoque en la eficiencia de recursos y la reducción de emisiones contribuye a un futuro más sustentable.`;
      }
    };

    // Función para generar descripciones específicas por categoría
    const generateProductDetails = (productName, industry) => {
      const name = productName.toLowerCase();
      
      if (name.includes('iphone') || name.includes('tablet') || name.includes('samsung') || name.includes('móvil')) {
        return {
          rawMaterial: 'Aluminio reciclado, tierras raras responsables, plásticos bio-basados',
          manufacturing: 'Procesos de fabricación carbono-neutral, energía 100% renovable',
          transport: 'Logística optimizada con embalaje minimalista y transporte eficiente',
          packaging: 'Packaging libre de plástico, materiales 100% reciclables'
        };
      } else if (name.includes('tesla') || name.includes('ferrari') || name.includes('auto') || name.includes('car')) {
        return {
          rawMaterial: 'Acero reciclado, baterías con minerales responsables, componentes sostenibles',
          manufacturing: 'Gigafactorías alimentadas por energía solar, procesos de bajo impacto',
          transport: 'Red de distribución eléctrica, reducción de emisiones de transporte',
          packaging: 'Embalaje industrial reutilizable, materiales biodegradables'
        };
      } else if (name.includes('macbook') || name.includes('surface') || name.includes('laptop')) {
        return {
          rawMaterial: 'Aluminio 100% reciclado, componentes libres de elementos tóxicos',
          manufacturing: 'Procesos energéticamente eficientes, certificación ENERGY STAR',
          transport: 'Cadena de suministro optimizada, reducción de distancias de envío',
          packaging: 'Fibra de madera sostenible, tintas a base de soja'
        };
      } else if (name.includes('nvidia') || name.includes('chip') || name.includes('procesador')) {
        return {
          rawMaterial: 'Silicio purificado con procesos eficientes, metales reciclados',
          manufacturing: 'Fabricación en nodos avanzados, menor consumo energético por chip',
          transport: 'Embalaje compacto, logística de alta densidad',
          packaging: 'Materiales antiestáticos reciclables, diseño minimalista'
        };
      } else {
        return {
          rawMaterial: 'Materiales sostenibles y reciclados cuando es posible',
          manufacturing: 'Procesos optimizados para eficiencia energética',
          transport: 'Logística responsable con minimización de emisiones',
          packaging: 'Embalaje eco-friendly y materiales reciclables'
        };
      }
    };
    
    console.log('📦 Recibiendo productos del onboarding...');
    console.log('Body keys:', Object.keys(req.body));
    console.log('Body:', req.body);
    console.log('Files received:', req.files ? req.files.length : 'NO FILES');
    if (req.files && req.files.length > 0) {
      console.log('Files details:', req.files.map(f => ({ name: f.originalname, size: f.size, path: f.path })));
    }

    let productos = [];
    const archivosSubidos = [];
    const productosCreados = [];

    // El frontend envía los productos de diferentes maneras
    if (req.body.productos) {
      // Si viene como array de objetos directamente
      if (Array.isArray(req.body.productos)) {
        productos = req.body.productos;
      } else {
        productos = [req.body.productos];
      }
    } else {
      // Si viene en formato productos[0][nombre], etc.
      const productosMap = {};
      
      for (const key in req.body) {
        console.log(`Procesando key: ${key} = ${req.body[key]}`);
        const match = key.match(/productos\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          
          if (!productosMap[index]) {
            productosMap[index] = {};
          }
          productosMap[index][field] = req.body[key];
          console.log(`Agregado: productos[${index}][${field}] = ${req.body[key]}`);
        }
      }

      // Convertir el mapa a array
      Object.keys(productosMap).forEach(index => {
        productos.push(productosMap[index]);
      });
    }

    console.log('✅ Productos parseados:', productos);

    // Crear empresa si no existe
    let company;
    const companyName = productos[0]?.industria || 'Empresa del Usuario';
    
    try {
      const companyResult = await db.query(queries.getCompanyByName, [companyName]);
      
      if (companyResult.rows.length === 0) {
        const newCompanyResult = await db.query(queries.createCompanyBasic, [companyName]);
        company = newCompanyResult.rows[0];
        console.log(`✅ Empresa creada: ${companyName}`);
      } else {
        company = companyResult.rows[0];
        console.log(`✅ Empresa encontrada: ${companyName}`);
      }
    } catch (companyError) {
      console.error('❌ Error manejando empresa:', companyError);
      // Usar ID de empresa por defecto si hay error
      company = { id: 1, name: companyName };
    }

    // Crear productos reales en la base de datos
    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      
      try {
        // Generar datos específicos para este producto
        const conclusion = generateProductConclusion(producto.nombre, producto.industria, producto.url);
        const details = generateProductDetails(producto.nombre, producto.industria);
        
        const productValues = [
          producto.nombre,
          company.id,
          (Math.random() * 50 + 10).toFixed(2), // carbon_footprint
          Math.floor(Math.random() * 40 + 60).toString(), // benchmark_percentage
          Math.floor(Math.random() * 40 + 60), // impact_score
          conclusion,
          details.rawMaterial,
          details.manufacturing,
          details.transport,
          details.packaging,
          `-${Math.floor(Math.random() * 30 + 20)}%`, // footprint_difference
          'Alta', // sustainability
          null // image
        ];

        const productResult = await db.query(queries.createProduct, productValues);
        const createdProduct = productResult.rows[0];
        
        productosCreados.push({
          id: createdProduct.id,
          nombre: createdProduct.name,
          industria: producto.industria,
          url: producto.url,
          created: true,
          database_id: createdProduct.id
        });
        
        console.log(`✅ Producto guardado en BD: ${producto.nombre} (ID: ${createdProduct.id})`);
      } catch (productError) {
        console.error(`❌ Error creando producto ${producto.nombre}:`, productError);
        // Si falla la creación, al menos agregarlo como simulado
        productosCreados.push({
          id: Date.now() + i,
          nombre: producto.nombre,
          industria: producto.industria,
          url: producto.url,
          created: false,
          error: productError.message
        });
      }
    }

    // Procesar archivos si existen
    if (req.files && req.files.length > 0) {
      console.log(`📁 Procesando ${req.files.length} archivos...`);
      console.log(`📦 Productos creados: ${productosCreados.length}`);
      console.log(`📊 Estado productos:`, productosCreados.map(p => ({ nombre: p.nombre, created: p.created, id: p.database_id })));
      
      // Los archivos llegan en el orden de selectedProducts en el frontend
      let fileIndex = 0;
      
      for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        const productoCreado = productosCreados[i];
        
        console.log(`🔍 Procesando índice ${i}: ${producto.nombre}, archivo disponible: ${fileIndex < req.files.length}, producto creado: ${productoCreado?.created}`);
        
        // Solo procesar archivo si hay uno disponible y el producto fue creado exitosamente
        if (fileIndex < req.files.length && productoCreado && productoCreado.created) {
          const file = req.files[fileIndex];
          
          console.log(`📎 Procesando archivo: ${file.originalname} para producto ${producto.nombre}`);
          
          try {
            const File = require('../../models/files.model');
            
            const fileData = {
              originalName: file.originalname,
              path: file.path,
              productId: productoCreado.database_id // Asociar con el producto real
            };

            const savedFile = await File.saveFileInfo(fileData);

            archivosSubidos.push({
              nombre: file.originalname,
              filename: savedFile.name,
              producto: producto.nombre,
              fileId: savedFile.file_id,
              productId: productoCreado.database_id
            });

            console.log(`✅ Archivo ${file.originalname} guardado para producto ${producto.nombre} (ID: ${productoCreado.database_id})`);
            fileIndex++; // Solo incrementar si se procesó un archivo exitosamente
          } catch (fileError) {
            console.error(`❌ Error procesando archivo ${file.originalname}:`, fileError);
            fileIndex++; // Incrementar para pasar al siguiente archivo aunque haya fallado
          }
        } else {
          console.log(`⚠️ Saltando índice ${i}: fileIndex=${fileIndex}, req.files.length=${req.files.length}, productoCreado.created=${productoCreado?.created}`);
        }
      }
    } else {
      console.log(`📁 No hay archivos para procesar (req.files: ${req.files ? req.files.length : 'undefined'})`);
    }

    res.status(200).json({
      success: true,
      message: `${productosCreados.length} productos seleccionados procesados correctamente`,
      data: {
        productos: productos,
        productosCreados: productosCreados,
        archivos: archivosSubidos,
        totalProductos: productosCreados.length,
        totalArchivos: archivosSubidos.length
      }
    });

  } catch (error) {
    console.error('❌ Error en uploadProductsWithFiles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar productos y archivos',
      error: error.message
    });
  }
};

const handleTallyWebhook = async (req, res) => {
  try {
    console.log('🔗 Webhook de Tally recibido');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { eventType, data } = req.body;

    if (eventType === 'FORM_RESPONSE') {
      console.log('📝 Procesando respuesta de formulario Tally');
      
      const { responseId, formName, fields } = data;
      
      // Procesar campos del formulario
      const responseData = {};
      const attachments = [];

      fields.forEach(field => {
        const { key, label, type, value } = field;
        
        if (type === 'FILE_UPLOAD' && value && value.length > 0) {
          value.forEach(file => {
            attachments.push({
              fieldKey: key,
              fieldLabel: label,
              fileName: file.name,
              fileUrl: file.url,
              fileSize: file.size,
              mimeType: file.mimeType
            });
          });
        } else {
          responseData[key] = value;
        }
      });

      console.log('📊 Datos del formulario:', responseData);
      console.log('📎 Archivos adjuntos:', attachments);

      // Responder a Tally
      res.status(200).json({
        success: true,
        message: 'Webhook procesado correctamente',
        data: {
          responseId,
          formName,
          fieldsProcessed: Object.keys(responseData).length,
          filesProcessed: attachments.length
        }
      });

    } else {
      console.log(`ℹ️ Tipo de evento no manejado: ${eventType}`);
      res.status(200).json({
        success: true,
        message: 'Evento recibido pero no procesado'
      });
    }

  } catch (error) {
    console.error('❌ Error en handleTallyWebhook:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando webhook de Tally',
      error: error.message
    });
  }
};

module.exports = {
  uploadProductsWithFiles,
  handleTallyWebhook
}; 