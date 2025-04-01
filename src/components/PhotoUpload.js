import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const PhotoUploadAndAgreement = ({ setUser, user }) => {
  const [photos, setPhotos] = useState(user.photos || []);
  const [agreement, setAgreement] = useState(user.agreement || false);
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const newPhotos = [...photos, ...e.target.files];
    setPhotos(newPhotos);
  };

  const handleSubmit = async () => {
    if (photos.length > 0 && agreement) {
      const formData = new FormData();
      formData.append("chat_id", user.chat_id);
      formData.append("accepted", agreement);
      photos.forEach((photo, index) => {
        formData.append(`files`, photo);
      });

      try {
        await axios.post(`${API_BASE_URL}/api/user/photos`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setUser({ ...user, photos, agreement });
        navigate("/selfie");
      } catch (error) {
        console.error("Ошибка при загрузке фотографий:", error);
      }
    } else {
      alert("Загрузите фото и примите условия");
    }
  };

  return (
    <div>
      <h2>Загрузите фотографии (до 3)</h2>
      <input type="file" multiple onChange={handlePhotoChange} />
      <div>
        {photos.map((photo, index) => (
          <p key={index}>{photo.name}</p>
        ))}
      </div>
      <label>
        <input type="checkbox" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
        Я принимаю условия соглашения
      </label>
      <button onClick={handleSubmit}>Далее</button>
    </div>
  );
};

export default PhotoUploadAndAgreement;