import React, { useState } from 'react';
import axios from 'axios';

function PhotoUpload({ user, onComplete }) {
  const [photos, setPhotos] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const handlePhotoChange = (event) => {
    const files = event.target.files;
    setPhotos(Array.from(files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('chat_id', user.chat_id);
    formData.append('name', user.name || ''); // Предполагаем, что данные уже заполнены в ProfileSetup
    formData.append('instagram', user.instagram || '');
    formData.append('bio', user.bio || '');
    formData.append('country', user.country || '');
    formData.append('city', user.city || '');
    formData.append('birth_date', user.birth_date || '');
    formData.append('gender', user.gender || '');
    formData.append('min_age_partner', user.min_age_partner || 18);

    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    try {
      await axios.post(`${apiBaseUrl}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      onComplete();
    } catch (error) {
      console.error('Ошибка при загрузке фото:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="photo-upload">
      <h2>Загрузите фото</h2>
      <p>Пожалуйста, загрузите минимум одно фото.</p>
      <input type="file" accept="image/*" multiple onChange={handlePhotoChange} required />
      <button onClick={handleSubmit}>Продолжить</button>
    </div>
  );
}

export default PhotoUpload;