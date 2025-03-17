import React, { useState } from 'react';
import axios from 'axios';

function ProfileSetup({ user, setUser }) {
  const [language, setLanguage] = useState('ru');
  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [photo, setPhoto] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const translations = {
    ru: {
      title: 'Заполните профиль',
      language: 'Выберите язык',
      name: 'Имя',
      instagram: 'Instagram (instagram.com/)',
      bio: 'О себе',
      country: 'Страна',
      city: 'Город',
      birthDate: 'Дата рождения',
      gender: 'Выберите ваш пол',
      male: 'Я парень',
      female: 'Я девушка',
      photo: 'Загрузите фото (минимум 1)',
      warning: 'Только реальные фото, никаких скриншотов или изображений с использованием ИИ. Вы должны быть на фото.',
      continue: 'Продолжить',
      ageError: 'Минимальный возраст — 18 лет',
      photoError: 'Загрузите минимум 1 фото',
    },
    en: {
      title: 'Fill out your profile',
      language: 'Choose language',
      name: 'Name',
      instagram: 'Instagram (instagram.com/)',
      bio: 'About me',
      country: 'Country',
      city: 'City',
      birthDate: 'Date of birth',
      gender: 'Select your gender',
      male: 'I am a guy',
      female: 'I am a girl',
      photo: 'Upload photo (minimum 1)',
      warning: 'Only real photos, no screenshots or AI-generated images. You must be in the photo.',
      continue: 'Continue',
      ageError: 'Minimum age is 18 years',
      photoError: 'Upload at least 1 photo',
    },
    uz: {
      title: "Profilingizni to'ldiring",
      language: 'Tilni tanlang',
      name: 'Ism',
      instagram: 'Instagram (instagram.com/)',
      bio: 'Men haqimda',
      country: 'Davlat',
      city: 'Shahar',
      birthDate: 'Tug‘ilgan sana',
      gender: 'Jinsingizni tanlang',
      male: 'Men yigitman',
      female: 'Men qizman',
      photo: 'Rasm yuklang (kamida 1 ta)',
      warning: "Faqat haqiqiy fotosuratlar, skrinshotlar yoki sun'iy intellekt yordamida yaratilgan tasvirlar emas. Siz fotosuratda bo‘lishingiz kerak.",
      continue: 'Davom etish',
      ageError: 'Minimal yosh — 18 yil',
      photoError: 'Kamida 1 ta rasm yuklang',
    },
  };

  const t = translations[language];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    if (age < 18) {
      alert(t.ageError);
      return;
    }
    if (!photo) {
      alert(t.photoError);
      return;
    }

    const formData = new FormData();
    formData.append('chat_id', user.chat_id);
    formData.append('name', name);
    formData.append('instagram', instagram);
    formData.append('bio', bio);
    formData.append('country', country);
    formData.append('city', city);
    formData.append('birth_date', birthDate);
    formData.append('gender', gender);
    formData.append('photo', photo);
    
    console.log('chat_id:', formData.get('chat_id'));
    console.log('name:', formData.get('name'));
    console.log('instagram:', formData.get('instagram'));
    console.log('bio:', formData.get('bio'));
    console.log('country:', formData.get('country'));
    console.log('photo:', formData.get('photo'));
    console.log('city:', formData.get('city'));
    console.log('birth_date:', formData.get('birth_date'));
    console.log('gender:', formData.get('gender'));
  
    try {
      
      await axios.post(`${apiBaseUrl}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      setUser({ ...user, isProfileComplete: true });
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error.response ? error.response.data : error.message);
      
    }
  };
  

  return (
    <div className="profile">
      <h2>{t.title}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t.language}</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
            <option value="uz">O‘zbekcha</option>
          </select>
        </div>
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
          <label>{t.photo}</label>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} required />
          <p>{t.warning}</p>
        </div>
        <button type="submit">{t.continue}</button>
      </form>
    </div>
  );
}

export default ProfileSetup;