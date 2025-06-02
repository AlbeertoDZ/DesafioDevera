// src/components/Tabs/Tabs.jsx
import React, { useState } from 'react';
import './Tabs.scss';

const Tabs = ({ onSelect }) => {
  const [activeTab, setActiveTab] = useState('Mis productos');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onSelect?.(tab);
  };

  return (
    <div className="tabs-container">
      <button
        className={activeTab === 'Mis productos' ? 'tab active' : 'tab'}
        onClick={() => handleTabClick('Mis productos')}
      >
        Mis productos
      </button>
      <button
        className={activeTab === 'Archivos' ? 'tab' : 'tab disabled'}
        disabled
      >
        Archivos
      </button>
      <button
        className={activeTab === 'Información general' ? 'tab' : 'tab disabled'}
        disabled
      >
        Información general
      </button>
    </div>
  );
};

export default Tabs;