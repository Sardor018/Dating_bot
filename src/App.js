import React, { useState, useEffect, useCallback } from 'react';
import { Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Candidates from './components/Candidates';
import Chat from './components/Chat';
import Profile from './components/Profile';
import LanguageSelection from './components/LanguageSelection';
import ProfileSetup from './components/ProfileSetup';
import PhotoUpload from './components/PhotoUpload';
import SelfieVerification from './components/SelfieVerification';
import { FaRegUserCircle } from 'react-icons/fa';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdFavoriteBorder } from 'react-icons/md';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function App() {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const saveUser = (userData) => {
    console.log("Сохранение пользователя:", userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const verifyTelegramInitData = useCallback(async () => {
    if (!window.Telegram?.WebApp) return null;
    const telegram = window.Telegram.WebApp;
    telegram.ready();
    if (!telegram.initData) return null;
    const { id } = telegram.initDataUnsafe.user;
    return id.toString();
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      const chatId = await verifyTelegramInitData() || "2092771486"; // Для тестирования
      if (!chatId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/check_user`, {
          params: { chat_id: chatId }
        });
        const userData = {
          chat_id: chatId,
          isProfileComplete: data.is_verified,
          selectedLanguage: data.selected_language || null,
          name: data.name || "",
          photos: data.photos || [],
          selfie: data.selfie || null 
        };
        saveUser(userData);
        if (!data.is_verified) {
          if (!userData.selectedLanguage) {
            navigate('/language');
          } else if (!userData.name) {
            navigate('/profile');
          } else if (!userData.photos || data.photos.length === 0) {
            navigate('/photos');
          } else if (!userData.selfie) {
            navigate('/selfie');
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        const userData = {
          chat_id: chatId,
          isProfileComplete: false,
          selectedLanguage: null
        };
        saveUser(userData);
        navigate('/language');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [navigate, verifyTelegramInitData]);

  if (loading) {
    return <div className='loader'>Загрузка...</div>;
  }

  if (!user) {
    return (
      <div>
        <h2>Войдите через Telegram</h2>
        <p>Нажмите "Войти" в Telegram-боте @DatingAppBot для авторизации.</p>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/language" element={<LanguageSelection setUser={saveUser} user={user} />} />
        <Route path="/profile" element={<ProfileSetup setUser={saveUser} user={user} />} />
        <Route path="/photos" element={<PhotoUpload setUser={saveUser} user={user} />} />
        <Route path="/selfie" element={<SelfieVerification setUser={saveUser} user={user} />} />
        <Route path="/" element={
          user.isProfileComplete ? (
            <Candidates setSelectedMatch={setSelectedMatch} currentUserChatId={user.chat_id} />
          ) : (
            <LanguageSelection setUser={saveUser} user={user} />
          )
        } />
        {user.isProfileComplete && (
          <>
            <Route path="/chat" element={<Chat match={selectedMatch} />} />
            <Route path="/profile-view" element={<Profile chatId={user.chat_id} />} />
          </>
        )}
      </Routes>
      {user.isProfileComplete && (
        <nav>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <MdFavoriteBorder size={24} />
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <IoChatbubbleEllipsesOutline size={24} />
          </NavLink>
          <NavLink to="/profile-view" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <FaRegUserCircle size={24} />
          </NavLink>
        </nav>
      )}
    </div>
  );
}

export default App;