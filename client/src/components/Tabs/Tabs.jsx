import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Tabs.scss';

const Tabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname === '/files' ? 'Archivos' : 'Mis productos';

  return (
    <div className="tabs-container">
      <button
        className={activeTab === 'Mis productos' ? 'tab active' : 'tab'}
        onClick={() => navigate('/dashboard')}
      >
        Mis productos
      </button>

      <button
        className={activeTab === 'Archivos' ? 'tab active' : 'tab'}
        onClick={() => navigate('/files')}
      >
        Archivos
      </button>
    </div>
  );
};

export default Tabs;