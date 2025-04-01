import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactFlagsSelect from "react-flags-select";
import { City } from "country-state-city";
import "../style/ProfileSetup.css";

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

  const [showCityList, setShowCityList] = useState(false);
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const selectedLanguage = user.selectedLanguage || "ru";
  const translations = {
    ru: { name: "Имя", country: "Страна", city: "Город", birthDate: "Дата рождения", gender: "Пол", male: "Я парень", female: "Я девушка", continue: "Продолжить" },
    en: { name: "Name", country: "Country", city: "City", birthDate: "Date of birth", gender: "Gender", male: "I am a guy", female: "I am a girl", continue: "Continue" },
    uz: { name: "Ism", country: "Davlat", city: "Shahar", birthDate: "Tug‘ilgan sana", gender: "Jins", male: "Men yigitman", female: "Men qizman", continue: "Davom etish" },
  };
  const t = translations[selectedLanguage] || translations["ru"];
  const navigate = useNavigate();

  // Fetch cities when country changes
  useEffect(() => {
    if (formData.country) {
      setIsLoadingCities(true);
      const countryCities = City.getCitiesOfCountry(formData.country);
      setCities(countryCities || []);
      setIsLoadingCities(false);
    } else {
      setCities([]);
    }
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCountryChange = (countryCode) => {
    setFormData({ ...formData, country: countryCode, city: "" }); // Reset city when country changes
    setShowCityList(true);
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
        gender: formData.gender,
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

      <div className="location-container">
        <label>{t.country}</label>
        <ReactFlagsSelect
          selected={formData.country}
          onSelect={handleCountryChange}
          placeholder={t.country}
          searchable
          className="country-select"
        />

        {formData.country && (
          <>
            <label>{t.city}</label>
            <button className="location-btn" onClick={() => setShowCityList(!showCityList)}>
              {formData.city || t.city}
              <span className="dropdown-icon">▼</span>
            </button>
            {showCityList && (
              <div className="dropdown-list">
                {isLoadingCities ? (
                  <div className="dropdown-item">Загрузка городов...</div>
                ) : cities.length > 0 ? (
                  cities.map(city => (
                    <div
                      key={city.name}
                      className="dropdown-item"
                      onClick={() => {
                        handleChange({ target: { name: "city", value: city.name } });
                        setShowCityList(false);
                      }}
                    >
                      {city.name}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">Города не найдены</div>
                )}
              </div>
            )}
          </>
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