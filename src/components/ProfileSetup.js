import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select"; // Импортируем react-select
import '../style/ProfileSetup.css';

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

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false); // Стейт для загрузки стран
  const [isLoadingCities, setIsLoadingCities] = useState(false); // Стейт для загрузки городов
  const selectedLanguage = user.selectedLanguage || "ru";

  const translations = {
    ru: { name: "Имя", city: "Город", birthDate: "Дата рождения", gender: "Пол", male: "Я парень", female: "Я девушка", continue: "Продолжить" },
    en: { name: "Name", city: "City", birthDate: "Date of birth", gender: "Gender", male: "I am a guy", female: "I am a girl", continue: "Continue" },
    uz: { name: "Ism", city: "Shahar", birthDate: "Tug‘ilgan sana", gender: "Jins", male: "Men yigitman", female: "Men qizman", continue: "Davom etish" },
  };
  const t = translations[selectedLanguage] || translations["ru"];
  const navigate = useNavigate();

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all'); // API for country list
        setCountries(response.data.map(country => ({
          value: country.cca2,
          label: country.name.common,
        })));
      } catch (error) {
        console.error("Ошибка при получении стран:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch cities when country changes
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
      setCities([]); // Если страна не выбрана, сбросить список городов
    }
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectCountry = (selectedOption) => {
    setFormData({ ...formData, country: selectedOption ? selectedOption.value : "" });
  };

  const handleSelectCity = (selectedOption) => {
    setFormData({ ...formData, city: selectedOption ? selectedOption.value : "" });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/user/profile`, new URLSearchParams({
        chat_id: user.chat_id,
        name: formData.name,
        instagram: formData.instagram,
        about: formData.about,
        country: formData.country,
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
        {isLoadingCountries ? (
          <p>Загрузка стран...</p> // Показать иконку или текст, когда страны загружаются
        ) : (
          <Select
            options={countries}
            value={countries.find(country => country.value === formData.country)}
            onChange={handleSelectCountry}
            isSearchable={true} // Включить поиск
            placeholder={t.city}
          />
        )}
      </div>

      <div>
        <label>{t.city}</label>
        {isLoadingCities ? (
          <p>Загрузка городов...</p> // Показать иконку или текст, когда города загружаются
        ) : (
          <Select
            options={cities}
            value={cities.find(city => city.value === formData.city)}
            onChange={handleSelectCity}
            isSearchable={true} // Включить поиск
            placeholder={t.city}
            isDisabled={!formData.country} // Заблокировать выбор города, если страна не выбрана
          />
        )}
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
