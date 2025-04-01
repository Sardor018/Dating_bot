import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const SelfieVerification = ({ setUser, user }) => {
  const [selfie, setSelfie] = useState(null);
  const navigate = useNavigate();

  const handleSelfieChange = (e) => {
    setSelfie(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selfie) {
      alert("Загрузите селфи для верификации");
      return;
    }

    if (!user || !user.chat_id) {
      alert("Ошибка: нет chat_id");
      return;
    }

    const formData = new FormData();
    formData.append("chat_id", user.chat_id);
    formData.append("file", selfie);

    try {
      await axios.post(`${API_BASE_URL}/api/user/selfie`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUser({ ...user, selfie, isProfileComplete: true });
      navigate("/");
    } catch (error) {
      console.error("Ошибка при сохранении селфи:", error);
      alert("Ошибка при загрузке фото. Попробуйте снова.");
    }
  };

  return (
    <div>
      <h2>Загрузите селфи для верификации</h2>
      <input type="file" accept="image/*" onChange={handleSelfieChange} />
      {selfie && <p>Выбрано: {selfie.name}</p>}
      <button onClick={handleSubmit}>Завершить регистрацию</button>
    </div>
  );
};

export default SelfieVerification;
