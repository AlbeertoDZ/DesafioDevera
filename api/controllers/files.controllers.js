const uploadProductsWithFiles = async (req, res) => {
  try {
    console.log('📦 Recibiendo productos del onboarding...');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const productos = [];
    const archivosSubidos = [];

    // Parsear los productos del FormData
    // Los productos vienen como productos[0][nombre], productos[0][url], etc.
    const productosMap = {};
    
    for (const key in req.body) {
      const match = key.match(/productos\[(\d+)\]\[(\w+)\]/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        
        if (!productosMap[index]) {
          productosMap[index] = {};
        }
        productosMap[index][field] = req.body[key];
      }
    }

    // Convertir el mapa a array
    Object.keys(productosMap).forEach(index => {
      productos.push(productosMap[index]);
    });

    console.log('✅ Productos parseados:', productos);

    // Procesar archivos si existen
    if (req.files && req.files.length > 0) {
      console.log(`📁 Procesando ${req.files.length} archivos...`);
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const producto = productos[i]; // Asociar archivo con producto por índice
        
        if (producto) {
          try {
            // Leer el archivo y convertirlo a bytea
            const fileContent = fs.readFileSync(file.path);
            const fileData = fileContent.toString('base64');

            // Buscar el producto en la BD para obtener su ID
            const productResult = await pool.query(
              'SELECT id FROM products WHERE name ILIKE $1 LIMIT 1',
              [`%${producto.nombre}%`]
            );

            let productId = null;
            if (productResult.rows.length > 0) {
              productId = productResult.rows[0].id;
            }

            // Guardar archivo en la BD
            const savedFile = await saveFileInfo({
              name: file.filename,
              originalName: file.originalname,
              content: fileData,
              size: file.size,
              mimeType: file.mimetype,
              productId: productId
            });

            archivosSubidos.push({
              nombre: file.originalname,
              filename: file.filename,
              producto: producto.nombre,
              fileId: savedFile.file_id
            });

            // Eliminar archivo temporal
            fs.unlinkSync(file.path);
            
            console.log(`✅ Archivo ${file.originalname} guardado para producto ${producto.nombre}`);
          } catch (fileError) {
            console.error(`❌ Error procesando archivo ${file.originalname}:`, fileError);
            // Eliminar archivo temporal en caso de error
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Productos y archivos procesados correctamente',
      data: {
        productos: productos,
        archivos: archivosSubidos,
        totalProductos: productos.length,
        totalArchivos: archivosSubidos.length
      }
    });

  } catch (error) {
    console.error('❌ Error en uploadProductsWithFiles:', error);
    
    // Limpiar archivos temporales en caso de error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

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
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { eventId, eventType, createdAt, data } = req.body;

    if (eventType === 'FORM_RESPONSE') {
      console.log('📝 Procesando respuesta de formulario Tally');
      
      const { formId, formName, responseId, fields } = data;
      
      // Procesar campos del formulario
      const responseData = {};
      const attachments = [];

      fields.forEach(field => {
        const { key, label, type, value } = field;
        
        if (type === 'FILE_UPLOAD' && value && value.length > 0) {
          // Manejar archivos adjuntos
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
          // Manejar otros tipos de campos
          responseData[key] = value;
        }
      });

      // Guardar respuesta en base de datos (opcional)
      console.log('📊 Datos del formulario:', responseData);
      console.log('📎 Archivos adjuntos:', attachments);

      // Si hay archivos, descargarlos y guardarlos en nuestra BD
      if (attachments.length > 0) {
        console.log(`📁 Procesando ${attachments.length} archivos de Tally...`);
        
        for (const attachment of attachments) {
          try {
            // Descargar archivo desde la URL de Tally
            const response = await fetch(attachment.fileUrl);
            if (!response.ok) {
              throw new Error(`Error descargando archivo: ${response.statusText}`);
            }

            const fileBuffer = Buffer.from(await response.arrayBuffer());
            const fileData = fileBuffer.toString('base64');

            // Generar nombre único para el archivo
            const timestamp = Date.now();
            const uniqueName = `tally_${timestamp}_${attachment.fileName}`;

            // Guardar en nuestra base de datos
            const savedFile = await saveFileInfo({
              name: uniqueName,
              originalName: attachment.fileName,
              content: fileData,
              size: attachment.fileSize || fileBuffer.length,
              mimeType: attachment.mimeType,
              productId: null // Se puede asociar después si es necesario
            });

            console.log(`✅ Archivo ${attachment.fileName} guardado con ID: ${savedFile.file_id}`);

          } catch (fileError) {
            console.error(`❌ Error procesando archivo ${attachment.fileName}:`, fileError);
          }
        }
      }

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
  uploadFile,
  uploadMultipleFiles,
  getFiles,
  downloadFile,
  getFileByName,
  deleteFile,
  uploadProductsWithFiles,
  handleTallyWebhook
}; 