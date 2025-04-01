import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [filteredCountries, setFilteredCountries] = useState([]);
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
        setFilteredCountries(response.data.map(country => ({
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

  // Функция фильтрации стран по вводу
  const handleCountrySearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = countries.filter(country =>
      country.label.toLowerCase().includes(query)
    );
    setFilteredCountries(filtered);
  };

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

  const handleSelectCountry = (e) => {
    setFormData({ ...formData, country: e.target.value });
  };

  const handleSelectCity = (e) => {
    setFormData({ ...formData, city: e.target.value });
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
        <input
          type="text"
          placeholder="Поиск страны..."
          onChange={handleCountrySearch}
        />
        {isLoadingCountries ? (
          <p>Загрузка стран...</p>
        ) : (
          <select name="country" value={formData.country} onChange={handleSelectCountry}>
            <option value="">{t.city}</option>
            {filteredCountries.map(country => (
              <option key={country.value} value={country.value}>{country.label}</option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label>{t.city}</label>
        {isLoadingCities ? (
          <p>Загрузка городов...</p>
        ) : (
          <select name="city" value={formData.city} onChange={handleSelectCity} disabled={!formData.country}>
            <option value="">{t.city}</option>
            {cities.map(city => (
              <option key={city.value} value={city.value}>{city.label}</option>
            ))}
          </select>
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
