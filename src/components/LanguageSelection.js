import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/LanguageSelection.css";

const languages = ["O'zbekcha", "English", "Русский"];

const LanguageSelector = ({ setUserData }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("Русский");
  const navigate = useNavigate();

  const handleLanguageSelection = () => {
    setUserData((prev) => ({
      ...prev,
      selectedLanguage: selectedLanguage === "Русский" ? "ru" : 
                         selectedLanguage === "English" ? "en" : "uz",
    }));
    navigate("/profile"); 
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
