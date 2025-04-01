import { useState } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import worldCities from 'world-cities'; // Optional: for city data

function ProfileForm({ t, formData, handleChange, handleSubmit }) {
  const [showCityList, setShowCityList] = useState(false);

  // Get cities by country (using world-cities package or your own list)
  const getCitiesByCountry = (countryName) => {
    return worldCities
      .filter(city => city.country === countryName)
      .map(city => city.name);
  };

  // Handle country selection from ReactFlagsSelect
  const handleCountryChange = (countryCode) => {
    const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode);
    handleChange({ target: { name: 'country', value: countryName } });
    setShowCityList(true); // Show city list after country selection
  };

  return (
    <div>
      <h2>{t.name}</h2>
      <input type="text" name="name" placeholder={t.name} value={formData.name} onChange={handleChange} />
      <input type="text" name="instagram" placeholder="Instagram (необязательно)" value={formData.instagram} onChange={handleChange} />
      <textarea name="about" placeholder="О себе" value={formData.about} onChange={handleChange}></textarea>
      
      <div className="location-container">
        {/* Country selector with flags */}
        <ReactFlagsSelect
          selected={formData.country ? Object.keys({ 'United States': 'US', 'United Kingdom': 'GB', 'Russia': 'RU' /* add more */ }).find(key => key === formData.country) : ''}
          onSelect={handleCountryChange}
          placeholder="Выбрать страну"
          searchable
          className="country-select"
        />

        {/* City button and dropdown */}
        {formData.country && (
          <>
            <button 
              className="location-btn" 
              onClick={() => setShowCityList(!showCityList)}
            >
              {formData.city || 'Выбрать город'}
              <span className="dropdown-icon">▼</span>
            </button>
            
            {showCityList && (
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
}

export default ProfileForm;