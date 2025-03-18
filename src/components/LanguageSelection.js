import React, { useState } from 'react';
import '../style/LanguageSelection.css';

function LanguageSelection({ onSelectLanguage }) {
  const [selectedLanguage, setSelectedLanguage] = useState('ru');

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSubmit = () => {
    onSelectLanguage(selectedLanguage);
  };

  return (
    <div>
      <h2>Выберите язык</h2>
      <select value={selectedLanguage} onChange={handleLanguageChange}>
        <option value="ru">Русский</option>
        <option value="en">English</option>
        <option value="uz">O‘zbekcha</option>
      </select>
      <button onClick={handleSubmit}>Далее</button>
    </div>
  );
}

export default LanguageSelection;