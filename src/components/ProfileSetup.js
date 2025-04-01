import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Country, State, City } from "react-country-state-city"; // Импортируем компоненты из пакета
import '../style/ProfileSetup.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const UserProfileForm = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    instagram: user.instagram || "",
    about: user.about || "",
    country: user.country || "",
    state: user.state || "",
    city: user.city || "",
    birthday: user.birthday || "",
    gender: user.gender || "",
  });

  const [isLoading, setIsLoading] = useState(false); // Стейт для загрузки
  const selectedLanguage = user.selectedLanguage || "ru";

  const translations = {
    ru: { name: "Имя", city: "Город", birthDate: "Дата рождения", gender: "Пол", male: "Я парень", female: "Я девушка", continue: "Продолжить" },
    en: { name: "Name", city: "City", birthDate: "Date of birth", gender: "Gender", male: "I am a guy", female: "I am a girl", continue: "Continue" },
    uz: { name: "Ism", city: "Shahar", birthDate: "Tug‘ilgan sana", gender: "Jins", male: "Men yigitman", female: "Men qizman", continue: "Davom etish" },
  };
  const t = translations[selectedLanguage] || translations["ru"];
  const navigate = useNavigate();

  // Функция изменения значений
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  useEffect(() => {
    if (formData.country) {
      setIsLoadingCities(true);
      const fetchCities = async () => {
        try {
          const response = await axios.get(`https://world-cities-api.herokuapp.com/cities?country=${formData.country}`);
          setCities(response.data.map(city => ({
            value: city.name,
            label: city.name,
          })));
        } catch (error) {
          console.error("Ошибка при получении городов:", error);
        } finally {
          setIsLoadingCities(false);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [formData.country]);

  // Отправка данных формы
  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/user/profile`, new URLSearchParams({
        chat_id: user.chat_id,
        name: formData.name,
        instagram: formData.instagram,
        about: formData.about,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        birthday: formData.birthday,
        gender: formData.gender
      }));
      setUser({ ...user, ...formData });
      navigate("/photos");
    } catch (error) {
      console.error("Ошибка при сохранении профиля:", error);
    }
  };

  return (
    <div>
      <h2>{t.name}</h2>
      <input type="text" name="name" placeholder={t.name} value={formData.name} onChange={handleChange} />
      <input type="text" name="instagram" placeholder="Instagram (необязательно)" value={formData.instagram} onChange={handleChange} />
      <textarea name="about" placeholder="О себе" value={formData.about} onChange={handleChange}></textarea>

      <div>
        <label>{t.city}</label>
        <Country value={formData.country} onChange={(value) => setFormData({ ...formData, country: value })} />
      </div>

      <div>
        <label>State</label>
        <State country={formData.country} value={formData.state} onChange={(value) => setFormData({ ...formData, state: value })} />
      </div>

      <div>
        <label>{t.city}</label>
        <City country={formData.country} state={formData.state} value={formData.city} onChange={(value) => setFormData({ ...formData, city: value })} />
      </div>

      <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />

      <div>
        <label>
          <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} /> {t.male}
        </label>
        <label>
          <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} /> {t.female}
        </label>
      </div>

      <button onClick={handleSubmit}>{t.continue}</button>
    </div>
  );
};

export default UserProfileForm;
