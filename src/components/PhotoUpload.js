import React, { useState } from 'react';
import axios from 'axios';
import './PhotoUpload.css';

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
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    try {
      await axios.post(`${apiBaseUrl}/upload_photos`, formData, {
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
    <div>
      <h2>Загрузите фото</h2>
      <p>Пожалуйста, загрузите минимум одно фото.</p>
      <input type="file" accept="image/*" multiple onChange={handlePhotoChange} required />
      <button onClick={handleSubmit}>Продолжить</button>
    </div>
  );
}

export default PhotoUpload;