import { useState, useMemo } from 'react';
import countryList from 'react-select-country-list';

function ProfileForm({ t, formData, handleChange, handleSubmit }) {
  const [showCountryList, setShowCountryList] = useState(false);
  const [showCityList, setShowCityList] = useState(false);
  
  // Get country list from the package
  const countries = useMemo(() => countryList().getData(), []);

  // Example city data (you'll need a separate source for cities)
  const cities = {
    'United States': ['New York', 'Los Angeles', 'Chicago'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham'],
    'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk'],
    // Add more as needed
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
            {countries.map(country => (
              <div 
                key={country.value} 
                className="dropdown-item"
                onClick={() => {
                  handleChange({ target: { name: 'country', value: country.label } });
                  setShowCountryList(false);
                  setShowCityList(true);
                }}
              >
                {country.label}
              </div>
            ))}
          </div>
        )}
        
        {showCityList && formData.country && cities[formData.country] && (
          <div className="dropdown-list">
            {cities[formData.country].map(city => (
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