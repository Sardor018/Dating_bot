import { useState } from 'react';
import { countries } from 'countries-list';
import worldCities from 'world-cities';

function ProfileForm({ t, formData, handleChange, handleSubmit }) {
  const [showCountryList, setShowCountryList] = useState(false);
  const [showCityList, setShowCityList] = useState(false);

  // Convert countries object to array
  const countryArray = Object.entries(countries).map(([code, data]) => ({
    code,
    name: data.name
  }));

  // Filter cities by selected country
  const getCitiesByCountry = (countryName) => {
    return worldCities
      .filter(city => city.country === countryName)
      .map(city => city.name);
  };

  return (
    <div>
      <h2>{t.name}</h2>
      <input type="text" name="name" placeholder={t.name} value={formData.name} onChange={handleChange} />
      <input type="text" name="instagram" placeholder="Instagram (необязательно)" value={formData.instagram} onChange={handleChange} />
      <textarea name="about" placeholder="О себе" value={formData.about} onChange={handleChange}></textarea>
      
      <div className="location-container">
        <button className="location-btn" onClick={() => setShowCountryList(!showCountryList)}>
          {formData.country ? `${formData.country}${formData.city ? ', ' + formData.city : ''}` : 'Выбрать город'}
          <span className="dropdown-icon">▼</span>
        </button>
        
        {showCountryList && !formData.country && (
          <div className="dropdown-list">
            {countryArray.map(country => (
              <div 
                key={country.code} 
                className="dropdown-item"
                onClick={() => {
                  handleChange({ target: { name: 'country', value: country.name } });
                  setShowCountryList(false);
                  setShowCityList(true);
                }}
              >
                {country.name}
              </div>
            ))}
          </div>
        )}
        
        {showCityList && formData.country && (
          <div className="dropdown-list">
            {getCitiesByCountry(formData.country).map(city => (
              <div 
                key={city} 
                className="dropdown-item"
                onClick={() => {
                  handleChange({ target: { name: 'city', value: city } });
                  setShowCityList(false);
                }}
              >
                {city}
              </div>
            ))}
          </div>
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
}

export default ProfileForm;