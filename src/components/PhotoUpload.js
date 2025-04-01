import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PhotoUploadAndAgreement = ({ setUserData }) => {
  const [photos, setPhotos] = useState([]);
  const [agreement, setAgreement] = useState(false);
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    setPhotos([...photos, ...e.target.files]); // Добавляем загруженные фото в состояние
  };

  const handleSubmit = () => {
    if (photos.length > 0 && agreement) {
      setUserData(prevState => ({ ...prevState, photos })); // Сохраняем фотографии и юридическое согласие в состояние
      navigate("/selfie"); // Переход на страницу селфи
    } else {
      alert("Загрузите фото и примите условия");
    }
  };

  return (
    <div>
      <h2>Загрузите фотографии (до 3)</h2>
      <input type="file" multiple onChange={handlePhotoChange} />

      <label>
        <input type="checkbox" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
        Я принимаю условия соглашения
      </label>

      <button onClick={handleSubmit}>Далее</button>
    </div>
  );
};

export default PhotoUploadAndAgreement;