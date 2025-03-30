import React, { useState } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

function ProfileSetup({ user, setUser, selectedLanguage }) {
  const [name, setName] = useState(user.name || '');
  const [country, setCountry] = useState(user.country || '');
  const [city, setCity] = useState(user.city || '');
  const [birthDate, setBirthDate] = useState(user.birth_date || '');
  const [gender, setGender] = useState(user.gender || '');

  const t = {
    ru: {
      name: 'Имя',
      city: 'Город',
      birthDate: 'Дата рождения',
      gender: 'Пол',
      male: 'Я парень',
      female: 'Я девушка',
      continue: 'Продолжить',
      ageError: 'Минимальный возраст — 18 лет',
    },
    en: {
      name: 'Name',
      city: 'City',
      birthDate: 'Date of birth',
      gender: 'Gender',
      male: 'I am a guy',
      female: 'I am a girl',
      continue: 'Continue',
      ageError: 'Minimum age is 18 years',
    },
    uz: {
      name: 'Ism',
      city: 'Shahar',
      birthDate: 'Tug‘ilgan sana',
      gender: 'Jins',
      male: 'Men yigitman',
      female: 'Men qizman',
      continue: 'Davom etish',
      ageError: 'Minimal yosh — 18 yil',
    },
  }[selectedLanguage];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    if (age < 18) {
      alert(t.ageError);
      return;
    }

    const updatedUser = {
      ...user,
      name,
      country,
      city,
      birth_date: birthDate,
      gender,
      isProfileComplete: false,
    };
    setUser(updatedUser);
    window.location.href = '/photos';
  };


  return (
    <div className="profile">
      <h2>Заполните профиль</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={t.name}
        />
        <CountryDropdown
          value={country}
          onChange={(val) => setCountry(val)}
          defaultOptionLabel="Выберите страну"
          classes="country-dropdown"
        />
        <RegionDropdown
          country={country}
          value={city}
          onChange={(val) => setCity(val)}
          defaultOptionLabel={t.city}
          classes="region-dropdown"
        />
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">{t.gender}</option>
          <option value="male">{t.male}</option>
          <option value="female">{t.female}</option>
        </select>
        <button type="submit">{t.continue}</button>
      </form>
    </div>
  );
}

export default ProfileSetup;