import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/LanguageSelection.css";

const languages = ["O'zbekcha", "English", "Русский"];

const LanguageSelector = ({ onSelectLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("Русский");
  const navigate = useNavigate();

  const handleLanguageSelection = () => {
    const langCode = selectedLanguage === "Русский" ? "ru" : 
                     selectedLanguage === "English" ? "en" : "uz";
    onSelectLanguage(langCode);
  };

  const handleLanguageClick = (lang) => {
    console.log("Выбран язык:", lang); // Добавляем лог для отладки
    setSelectedLanguage(lang);
  };

  return (
    <div className="language-selector">
      <h2>Выберите язык</h2>
      <ul>
        {languages.map((lang) => (
          <li
            key={lang}
            className={selectedLanguage === lang ? "selected" : ""}
            onClick={() => handleLanguageClick(lang)} // Используем отдельную функцию
          >
            {lang}
          </li>
        ))}
      </ul>
      <button onClick={handleLanguageSelection}>Продолжить</button>
    </div>
  );
};

export default LanguageSelector;