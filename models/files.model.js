const db = require('../config/db_pgsql');
const queries = require('../queries/queries');
const fs = require('fs').promises;
const path = require('path');

class File {
    // La tabla files ya existe, no necesitamos crearla
    static async createFilesTable() {
        console.log('Usando tabla files existente para productos');
    }

    // Guardar información del archivo en BD
    static async saveFileInfo(fileData) {
        // Leer el archivo y convertirlo a bytea para almacenar en BD
        let fileContent = null;
        try {
            const buffer = await fs.readFile(fileData.path);
            fileContent = buffer;
        } catch (error) {
            console.error('Error leyendo archivo:', error);
        }
        
        const values = [
            fileData.originalName,  // name
            fileData.productId || null,  // product_id  
            fileContent,  // content (bytea)
            fileData.originalName  // image (usamos el nombre original)
        ];

        try {
            const result = await db.query(queries.saveFileInfo, values);
            // Eliminar archivo físico ya que lo guardamos en BD
            try {
                await fs.unlink(fileData.path);
            } catch (unlinkError) {
                console.log('Archivo físico ya no existe:', unlinkError.message);
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error guardando archivo en BD:', error);
            throw error;
        }
    }

    // Obtener todos los archivos
    static async getAllFiles() {
        try {
            const result = await db.query(queries.getAllFiles);
            return result.rows;
        } catch (error) {
            console.error('Error obteniendo archivos:', error);
            throw error;
        }
    }

    // Obtener archivo por ID
    static async getFileById(id) {
        try {
            const result = await db.query(queries.getFileById, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error obteniendo archivo por ID:', error);
            throw error;
        }
    }

    // Obtener archivo por nombre
    static async getFileByName(filename) {
        try {
            const result = await db.query(queries.getFileByName, [filename]);
            return result.rows[0];
        } catch (error) {
            console.error('Error obteniendo archivo por nombre:', error);
            throw error;
        }
    }

    // Eliminar archivo de BD
    static async deleteFile(filename) {
        try {
            const result = await db.query(queries.deleteFile, [filename]);
            if (result.rows[0]) {
                return {
                    ...result.rows[0],
                    id: result.rows[0].file_id,
                    original_name: result.rows[0].name,
                    filename: result.rows[0].name
                };
            }
            return null;
        } catch (error) {
            console.error('Error eliminando archivo de BD:', error);
            throw error;
        }
    }

    // Verificar si archivo existe físicamente (no aplica, está en BD)
    static async fileExists(filepath) {
        return true; // Los archivos están en la BD
    }

    // Eliminar archivo físico (no aplica, está en BD)
    static async deletePhysicalFile(filepath) {
        return true; // No hay archivos físicos
    }
}

module.exports = File; 