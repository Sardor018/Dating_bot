import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Country, City } from "country-state-city"; // Импортируем API для работы с данными
import axios from "axios";
import "../style/ProfileSetup.css";
import Select from 'react-select';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const UserProfileForm = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    instagram: user.instagram || "",
    about: user.about || "",
    country: user.country || "",
    city: user.city || "",
    birthday: user.birthday || "",
    gender: user.gender || "",
  });

  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const selectedLanguage = user.selectedLanguage || "ru";
  const translations = {
    ru: { name: "Имя", country: "Страна", city: "Город", search: "Поиск", birthDate: "Дата рождения", gender: "Пол", male: "Я парень", female: "Я девушка", continue: "Продолжить" },
    en: { name: "Name", country: "Country", city: "City", search: "Search", birthDate: "Date of birth", gender: "Gender", male: "I am a guy", female: "I am a girl", continue: "Continue" },
    uz: { name: "Ism", country: "Davlat", city: "Shahar", search: "Qidirish", birthDate: "Tug‘ilgan sana", gender: "Jins", male: "Men yigitman", female: "Men qizman", continue: "Davom etish" },
  };
  const t = translations[selectedLanguage] || translations["ru"];
  const navigate = useNavigate();

  // Функция для загрузки списка городов по стране
  const fetchCities = async (countryCode) => {
    setIsLoadingCities(true);
    try {
      // Получаем города для выбранной страны
      const cities = City.getCitiesOfCountry(countryCode);
      setCities(cities.map(city => ({ value: city.name, label: city.name })));
    } catch (error) {
      console.error("Ошибка загрузки городов:", error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  // Обработчик изменения страны
  const handleCountryChange = (countryCode) => {
    setFormData({ ...formData, country: countryCode, city: "" });
    fetchCities(countryCode);
  };

  const handleSubmit = async () => {
    try {
      // Отправка данных на сервер
      await axios.post(`${API_BASE_URL}/api/user/profile`, new URLSearchParams({
        chat_id: user.chat_id,
        ...formData
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
      <input
        type="text"
        name="name"
        placeholder={t.name}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="text"
        name="instagram"
        placeholder="Instagram (необязательно)"
        value={formData.instagram}
        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
      />
      <textarea
        name="about"
        placeholder="О себе"
        value={formData.about}
        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
      ></textarea>

      {/* Выбор страны */}
      <select onChange={(e) => handleCountryChange(e.target.value)} value={formData.country}>
        {Country.getAllCountries().map((country) => (
          <option key={country.isoCode} value={country.isoCode}>
            {country.name}
          </option>
        ))}
      </select>

      {/* Выбор города */}
      {isLoadingCities ? (
        <p>Загрузка городов...</p>
      ) : (
        <Select
          options={cities}
          value={cities.find(c => c.value === formData.city)}
          onChange={(selected) => setFormData({ ...formData, city: selected.value })}
          placeholder={t.city}
          isSearchable
        />
      )}

      <input
        type="date"
        name="birthday"
        value={formData.birthday}
        onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
      />

      <div>
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === "male"}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          />{" "}
          {t.male}
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === "female"}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          />{" "}
          {t.female}
        </label>
      </div>

      <button onClick={handleSubmit}>{t.continue}</button>
    </div>
  );
};

export default UserProfileForm;
