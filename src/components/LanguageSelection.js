// components/LanguageSelector.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Хук для навигации
import '../style/LanguageSelection.css';

const LanguageSelector = ({ setUserData }) => {
  const [language, setLanguage] = useState(""); // Состояние для хранения выбранного языка
  const navigate = useNavigate(); // Инициализация навигации

  const handleLanguageSelection = (lang) => {
    setLanguage(lang); // Устанавливаем выбранный язык в состояние
    setUserData(prevState => ({ ...prevState, language: lang })); // Обновляем данные пользователя с выбранным языком
    navigate("/profile"); // Перенаправляем на страницу профиля после выбора языка
  };

  return (
    <div className="language-selection">
      <h2>Выберите язык</h2>
      <button onClick={() => handleLanguageSelection("uzbek")}>O'zbekcha</button>
      <button onClick={() => handleLanguageSelection("english")}>English</button>
      <button onClick={() => handleLanguageSelection("russian")}>Русский</button>
    </div>
  );
};

export default LanguageSelector;