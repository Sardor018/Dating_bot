import React, { useState, useEffect } from 'react';
import { Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const BOT_TOKEN = process.env.REACT_APP_BOT_TOKEN;

function App() {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugMessage, setDebugMessage] = useState('Ожидание Telegram Web App...');
  const [selectedLanguage, setSelectedLanguage] = useState('ru');
  const navigate = useNavigate(); // Добавляем useNavigate для программного перенаправления

  const verifyTelegramInitData = async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 5000));
    
    setDebugMessage(`Проверка window.Telegram... typeof window.Telegram: ${typeof window.Telegram}, URL: ${window.location.href}`);
    
    if (!window.Telegram) {
      setDebugMessage(`window.Telegram отсутствует (undefined). URL: ${window.location.href}`);
      return null;
    }
    if (!window.Telegram.WebApp) {
      setDebugMessage(`window.Telegram.WebApp отсутствует. Telegram SDK не загрузился. URL: ${window.location.href}`);
      return null;
    }

    const telegram = window.Telegram.WebApp;
    setDebugMessage('Telegram Web App найден. Вызываем ready()...');
    telegram.ready();

    const initData = telegram.initData;
    if (!initData) {
      setDebugMessage('initData пустое. Проверьте запуск через Telegram.');
      return null;
    }

    setDebugMessage(`initData получено: ${initData}`);

    const webAppUser = telegram.initDataUnsafe.user;
    if (!webAppUser?.id) {
      setDebugMessage('ID пользователя не найден в initData');
      return null;
    }

    const chatId = webAppUser.id.toString();
    setDebugMessage(`Успешная проверка. Telegram chat_id: ${chatId}`);
    return chatId;
  };

  useEffect(() => {
    const initializeUser = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (typeof parsedUser.chat_id !== 'string') {
          setDebugMessage('Ошибка: chat_id в localStorage не строка. Очищаем localStorage.');
          localStorage.removeItem('user');
          setLoading(false);
          return;
        }
        setUser(parsedUser);
        setDebugMessage(`Загружено из localStorage: chat_id = ${parsedUser.chat_id}, isProfileComplete = ${parsedUser.isProfileComplete}`);
        setLoading(false);
        return;
      }

      const chatId = await verifyTelegramInitData();
      if (!chatId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/check_user?chat_id=${chatId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        const userData = { chat_id: chatId, isProfileComplete: response.data.is_profile_complete };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setDebugMessage(prev => `${prev} | Ответ бэкенда: isProfileComplete = ${response.data.is_profile_complete}`);

        // Перенаправление на /language, если профиль не заполнен
        if (!response.data.is_profile_complete) {
          navigate('/language');
        }
      } catch (error) {
        setDebugMessage(prev => `${prev} | Ошибка: ${error.message}`);
        const userData = { chat_id: chatId, isProfileComplete: false };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        navigate('/language'); // Перенаправление при ошибке
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [navigate]);

  if (loading) {
    return (
      <div>
        <div>Загрузка...</div>
        <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>{debugMessage}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h2>Войдите через Telegram</h2>
        <p>Нажмите "Войти" в Telegram-боте @DatingAppBot для авторизации.</p>
        <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>{debugMessage}</div>
      </div>
    );
  }

  return (
    <div>
      <h1>Dating Mini Web</h1>
      <Routes>
        <Route path="/language" element={<LanguageSelection onSelectLanguage={(lang) => setSelectedLanguage(lang)} />} />
        <Route path="/profile" element={<ProfileSetup user={user} setUser={setUser} selectedLanguage={selectedLanguage} />} />
        <Route path="/photos" element={<PhotoUpload user={user} onComplete={() => setUser({ ...user, isProfileComplete: true })} />} />
        <Route
          path="/"
          element={
            user.isProfileComplete ? (
              <Candidates setSelectedMatch={setSelectedMatch} currentUserChatId={user.chat_id} />
            ) : (
              <LanguageSelection onSelectLanguage={(lang) => {
                setSelectedLanguage(lang);
                navigate('/profile'); // Используем navigate вместо window.location.href
              }} />
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
      <div style={{ position: 'fixed', bottom: '10px', left: '10px', padding: '10px', background: '#f0f0f0', border: '1px solid #ccc' }}>
        {debugMessage}
      </div>
    </div>
  );
}

export default App;