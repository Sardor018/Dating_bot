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
import { FaRegUserCircle } from 'react-icons/fa';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdFavoriteBorder } from 'react-icons/md';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function App() {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('ru');
  const navigate = useNavigate();

  // Вспомогательная функция для сохранения пользователя в localStorage и стейте
  const saveUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Функция проверки данных Telegram, вынесена с использованием useCallback для предотвращения лишних пересозданий
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
      // const savedUser = localStorage.getItem('user');
      // if (savedUser) {
      //   const parsedUser = JSON.parse(savedUser);
      //   if (typeof parsedUser.chat_id !== 'string') {
      //     localStorage.removeItem('user');
      //     setLoading(false);
      //     return;
      //   }
      //   setUser(parsedUser);
      //   setLoading(false);
      //   return;
      // }

      const chatId = await verifyTelegramInitData();
      if (!chatId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/check_user`, {
          params: { chat_id: chatId }
        });
        const userData = { chat_id: chatId, isProfileComplete: data.is_profile_complete };
        saveUser(userData);
        if (!data.is_profile_complete) navigate('/language');
      } catch (error) {
        // При ошибке создаём пользователя с незаполненным профилем
        const userData = { chat_id: chatId, isProfileComplete: false };
        saveUser(userData);
        navigate('/language');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [navigate, verifyTelegramInitData]);

  if (loading) {
    return (
      <div className='loader'>Загрузка...</div>
    );
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
        <Route
          path="/language" element={<LanguageSelection onSelectLanguage={setSelectedLanguage} />}
        />
        <Route
          path="/profile" element={<ProfileSetup user={user} setUser={setUser} selectedLanguage={selectedLanguage} />}
        />
        <Route path="/photos" element={<PhotoUpload user={user} onComplete={() => setUser({ ...user, isProfileComplete: true })} />}
        />
        <Route path="/" element={
            user.isProfileComplete ? ( <Candidates setSelectedMatch={setSelectedMatch} currentUserChatId={user.chat_id} />
            ) : (
              <LanguageSelection
                onSelectLanguage={(lang) => {
                  setSelectedLanguage(lang);
                  navigate('/profile');
                }}
              />
            )
          }
        />
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
