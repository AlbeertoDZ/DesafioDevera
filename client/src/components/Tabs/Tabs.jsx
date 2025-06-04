import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tabs.scss';

const Tabs = ({ onSelect }) => {
  const [activeTab, setActiveTab] = useState('Mis productos');
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onSelect?.(tab);
  };

  return (
    <div className="tabs-container">
      <button
        className={activeTab === 'Mis productos' ? 'tab active' : 'tab'}
        onClick={() => {
          handleTabClick('Mis productos');
          navigate('/dashboard');
        }}
      >
        Mis productos
      </button>

      <button
        className={activeTab === 'Archivos' ? 'tab active' : 'tab'}
        onClick={() => {
          handleTabClick('Archivos');
          navigate('/files');
        }}
      >
        Archivos
      </button>
    </div>
  );
};

export default Tabs;