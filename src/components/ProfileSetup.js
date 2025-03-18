import React, { useState } from 'react';
import axios from 'axios';

function ProfileSetup({ user, setUser, selectedLanguage }) {
  const [name, setName] = useState(user.name || '');
  const [instagram, setInstagram] = useState(user.instagram || '');
  const [bio, setBio] = useState(user.bio || '');
  const [country, setCountry] = useState(user.country || '');
  const [city, setCity] = useState(user.city || '');
  const [birthDate, setBirthDate] = useState(user.birth_date || '');
  const [gender, setGender] = useState(user.gender || '');
  const [minAgePartner, setMinAgePartner] = useState(user.min_age_partner || 18);

  const t = {
    ru: {
      name: 'Имя',
      instagram: 'Instagram (instagram.com/)',
      bio: 'О себе',
      country: 'Страна',
      city: 'Город',
      birthDate: 'Дата рождения',
      gender: 'Выберите ваш пол',
      male: 'Я парень',
      female: 'Я девушка',
      minAgePartner: 'Минимальный возраст партнера',
      continue: 'Продолжить',
      ageError: 'Минимальный возраст — 18 лет',
    },
    en: {
      name: 'Name',
      instagram: 'Instagram (instagram.com/)',
      bio: 'About me',
      country: 'Country',
      city: 'City',
      birthDate: 'Date of birth',
      gender: 'Select your gender',
      male: 'I am a guy',
      female: 'I am a girl',
      minAgePartner: 'Minimum age of partner',
      continue: 'Continue',
      ageError: 'Minimum age is 18 years',
    },
    uz: {
      name: 'Ism',
      instagram: 'Instagram (instagram.com/)',
      bio: 'Men haqimda',
      country: 'Davlat',
      city: 'Shahar',
      birthDate: 'Tug‘ilgan sana',
      gender: 'Jinsingizni tanlang',
      male: 'Men yigitman',
      female: 'Men qizman',
      minAgePartner: 'Hamkorning minimal yoshi',
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
      instagram,
      bio,
      country,
      city,
      birth_date: birthDate,
      gender,
      min_age_partner: minAgePartner,
      isProfileComplete: false, // Фото ещё не загружено
    };
    setUser(updatedUser);

    // Переходим к загрузке фото
    window.location.href = '/photos';
  };

  return (
    <div className="profile">
      <h2>Заполните профиль</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t.name}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>{t.instagram}</label>
          <input value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </div>
        <div>
          <label>{t.bio}</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} required />
        </div>
        <div>
          <label>{t.country}</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
        <div>
          <label>{t.city}</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div>
          <label>{t.birthDate}</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
        </div>
        <div>
          <label>{t.gender}</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">{t.gender}</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
          </select>
        </div>
        <div>
          <label>{t.minAgePartner}</label>
          <input type="number" value={minAgePartner} min="18" max="100" step="1" required
                 onChange={(e) => setMinAgePartner(e.target.value)} />
        </div>
        <button type="submit">{t.continue}</button>
      </form>
    </div>
  );
}

export default ProfileSetup;