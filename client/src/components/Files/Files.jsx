// src/components/Files/Files.jsx
import React, { useRef, useState } from 'react';
import Header from '../Header/Header';
import Tabs from '../Tabs/Tabs';
import './Files.scss';

const Files = () => {
  const fileInputRef = useRef(null);
  // En este estado guardamos directamente los objetos File que seleccionó el usuario
  const [filesList, setFilesList] = useState([]);

  // Al pulsar “+ Añadir más archivos” abrimos el selector de ficheros
  const handleAddFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Cuando el usuario selecciona uno o varios archivos
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFilesList((prev) => [...prev, ...selectedFiles]);
    }
    e.target.value = null; // para permitir volver a subir el mismo nombre si hace falta
  };

  // Al pulsar “Descargar archivos”, iremos uno por uno creando un <a> con objectURL
  const handleDownloadAll = () => {
    if (filesList.length === 0) return;

    filesList.forEach((file) => {
      // Creamos un ObjectURL temporal para este archivo
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name; // forzamos a que el nombre sea el original
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Liberamos el objectURL para no acumular memoria
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="files-page">
      <Header />
      <Tabs />

      <div className="files-tab">
        <button
          className="add-file-btn"
          onClick={handleAddFileClick}
        >
          + Añadir más archivos
        </button>

        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <button
          className="download-files-btn"
          onClick={handleDownloadAll}
          disabled={filesList.length === 0}
        >
          📂 Descargar archivos
        </button>
      </div>

      <div className="files-container">
        {filesList.length === 0 ? (
          <div className="placeholder">No hay archivos cargados aún.</div>
        ) : (
          filesList.map((file, idx) => (
            <div key={idx} className="file-item-wrapper">
              {/* Botón “X” para eliminar el archivo concreto */}
              <button
                type="button"
                className="remove-file-btn"
                onClick={() => {
                  setFilesList((prev) => prev.filter((_, i) => i !== idx));
                }}
              >
                ×
              </button>

              {/* Mostramos el icono y nombre del archivo */}
              <div className="file-item">
                <div className="file-icon">📄</div>
                <div className="file-name">{file.name}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Files;