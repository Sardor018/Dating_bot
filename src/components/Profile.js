import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Profile.css';


const Profile = ({ chatId }) => {
  const [profile, setProfile] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/profile/${chatId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error.response ? error.response.data : error.message);
      }
    };
    fetchProfile();
  }, [chatId, apiBaseUrl]);

  if (!profile) return <div>Загрузка профиля...</div>;
  return (
    <div className="profile-container">
      {/* Заголовок с именем */}
      <div className="profile-header">
        <h2>{profile.name}</h2>
      </div>

      {/* Аватар */}
      <div className="profile-avatar">
        {profile.photos && profile.photos.length > 0 ? (
          <img src={`data:image/jpeg;base64,${profile.photos[0]}`} alt="Аватар" />
        ) : (
          <div className="avatar-placeholder">Нет фото</div>
        )}
      </div>

      {/* Кнопки Edit Profile и Share Profile */}
      <div className="profile-actions">
        <button className="action-button">Edit Profile</button>
        <button className="action-button">Share Profile</button>
      </div>

      {/* Секция Invite Friend */}
      <div className="profile-actions">
        <button className="action-button">Invite Friend</button>
      </div>

      {/* Галерея фотографий */}
      <div className="photo-gallery">
        {profile.photos && profile.photos.slice(1).map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={`data:image/jpeg;base64,${photo}`} alt={`Фото ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;