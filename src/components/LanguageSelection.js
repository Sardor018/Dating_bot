import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/LanguageSelection.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const languages = ["O'zbekcha", "English", "Русский"];

const LanguageSelector = ({ setUser, user }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(user.selectedLanguage || "Русский");
  const navigate = useNavigate();

  const handleLanguageSelection = async () => {
    const langCode = selectedLanguage === "Русский" ? "ru" : 
                     selectedLanguage === "English" ? "en" : "uz";
    try {
      await axios.post(`${API_BASE_URL}/api/user/language`, new URLSearchParams({
        chat_id: user.chat_id,
        selected_language: langCode
      }));
      setUser({ ...user, selectedLanguage: langCode });
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка при сохранении языка:", error);
    }
  };

  return (
    <div className="language-selector">
      <h2>Выберите язык</h2>
      <ul>
        {languages.map((lang) => (
          <li
            key={lang}
            className={selectedLanguage === lang ? "selected" : ""}
            onClick={() => setSelectedLanguage(lang)}
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