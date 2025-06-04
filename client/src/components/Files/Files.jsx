import React from 'react'
import Header from "../Header/Header";
import Tabs from "../Tabs/Tabs";
import './Files.scss';

const Files = () => {
  return (
    <div>
      <Header />
      <Tabs />
      <div className='files-tab'>
        <button className='add-file-btn'>Añadir mas archivos</button>
        <button className='download-files-btn'>Descargar archivos 📂</button>
      </div>
      
    </div>
  )
}

export default Files
