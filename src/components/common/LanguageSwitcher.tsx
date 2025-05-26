'use client'; // Important for hooks and event handlers

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  // Basic styling for the buttons
  const buttonStyle = (isActive: boolean) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    marginRight: '8px',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: isActive ? '#e0e0e0' : '#fff',
    opacity: isActive ? 0.7 : 1,
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
      <button 
        onClick={() => setLanguage('en')} 
        disabled={language === 'en'}
        style={buttonStyle(language === 'en')}
        aria-pressed={language === 'en'}
      >
        English
      </button>
      <button 
        onClick={() => setLanguage('fr')} 
        disabled={language === 'fr'}
        style={buttonStyle(language === 'fr')}
        aria-pressed={language === 'fr'}
      >
        Français
      </button>
    </div>
  );
};

export default LanguageSwitcher;
