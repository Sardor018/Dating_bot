import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfileForm = ({ userData, setUserData }) => {
  const [formData, setFormData] = useState({
    name: "",
    instagram: "",
    about: "",
    country: "",
    city: "",
    birthday: "",
    gender: "",
  });

  const selectedLanguage = userData?.selectedLanguage || "ru";

  const translations = {
    ru: { name: "Имя", city: "Город", birthDate: "Дата рождения", gender: "Пол", male: "Я парень", female: "Я девушка", continue: "Продолжить" },
    en: { name: "Name", city: "City", birthDate: "Date of birth", gender: "Gender", male: "I am a guy", female: "I am a girl", continue: "Continue" },
    uz: { name: "Ism", city: "Shahar", birthDate: "Tug‘ilgan sana", gender: "Jins", male: "Men yigitman", female: "Men qizman", continue: "Davom etish" },
  };
  
  const t = translations[selectedLanguage] || translations["ru"]; // Защита от undefined

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    setUserData((prevState) => ({ ...prevState, ...formData }));
    navigate("/photos");
  };

  return (
    <div>
      <h2>{t.name}</h2>
      <input type="text" name="name" placeholder={t.name} value={formData.name} onChange={handleChange} />
      <input type="text" name="instagram" placeholder="Instagram (необязательно)" value={formData.instagram} onChange={handleChange} />
      <textarea name="about" placeholder="О себе" value={formData.about} onChange={handleChange}></textarea>

      <select name="country" value={formData.country} onChange={handleChange}>
        <option value="">{t.city}</option>
        {/* Опции стран */}
      </select>

      <select name="city" value={formData.city} onChange={handleChange}>
        <option value="">{t.city}</option>
        {/* Опции городов */}
      </select>

      <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />

      <div>
        <label>
          <input type="radio" name="gender" value="male" onChange={handleChange} /> {t.male}
        </label>
        <label>
          <input type="radio" name="gender" value="female" onChange={handleChange} /> {t.female}
        </label>
      </div>

      <button onClick={handleSubmit}>{t.continue}</button>
    </div>
  );
};

export default UserProfileForm;
