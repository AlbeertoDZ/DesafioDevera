// src/components/Files/Files.jsx
import React, { useRef, useState } from 'react';
import Header from '../Header/Header';
import Tabs from '../Tabs/Tabs';
import './Files.scss';

const Files = () => {
  const fileInputRef = useRef(null);
  const [filesList, setFilesList] = useState([]); 

  const handleAddFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFilesList((prev) => [...prev, ...selectedFiles]);
    }
    e.target.value = null;
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

        <button className="download-files-btn">
          📂 Descargar archivos
        </button>
      </div>

      <div className="files-container">
        {filesList.length === 0 ? (
          <div className="placeholder">
            No hay archivos cargados aún.
          </div>
        ) : (
          filesList.map((file, idx) => {
            // Para cada archivo, creamos un ObjectURL que servirá de href
            const objectURL = URL.createObjectURL(file);

            return (
              <a
                key={idx}
                href={objectURL}
                download={file.name}
                className="file-item"
                // Opcional: revocar el ObjectURL después de usarlo
                onClick={() => {
                  // Demoramos un tick para que comience la descarga y luego revocamos
                  setTimeout(() => URL.revokeObjectURL(objectURL), 1000);
                }}
              >
                <div className="file-icon">📄</div>
                <div className="file-name">{file.name}</div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Files;