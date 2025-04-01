// components/LanguageSelector.js
import React, {useState } from "react";
import { useNavigate } from "react-router-dom"; // Хук для навигации
import '../style/LanguageSelection.css';
const language = [
  "O'zbekcha",
  "English",
  "Русский"  
];

const LanguageSelector = ({ setUserData }) => {
  const  [selectedLanguage, setSelectedLanguage] = useState("Русский"); // Состояние для хранения выбранного языка
  const navigate = useNavigate(); // Инициализация навигации

  const handleLanguageSelection = (lang) => {
    setSelectedLanguage(lang); // Устанавливаем выбранный язык в состояние
    navigate("/profile"); // Перенаправляем на страницу профиля после выбора языка
  };

  return (
    <div className="language-selector">
      <h2>Выберите язык</h2>
      <ul>
        {language.map((lang) => (
          <li
            key={lang}
            className={selectedLanguage === lang ? "selected" : ""}
            onClick={() => setSelectedLanguage(lang)}
          >
            {lang}
          </li>
        ))}
      </ul>
      <button onClick={() => handleLanguageSelection(selectedLanguage)}>
        Продолжить</button>
    </div>
  );
};

export default LanguageSelector;