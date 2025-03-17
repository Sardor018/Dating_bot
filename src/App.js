import React, { useState, useEffect } from 'react';
import { Route, Routes, NavLink, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Candidates from './components/Candidates';
import Chat from './components/Chat';
import Profile from './components/Profile';
import ProfileSetup from './components/ProfileSetup';
import { FaRegUserCircle } from 'react-icons/fa';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdFavoriteBorder } from 'react-icons/md';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugMessage, setDebugMessage] = useState(''); // Один общий лог
  const [searchParams] = useSearchParams();

  const getTelegramUserId = () => {
    if (window.Telegram?.WebApp) {
      const telegram = window.Telegram.WebApp;
      telegram.ready();
      const user = telegram.initDataUnsafe?.user;
      if (user?.id) {
        setDebugMessage(`Telegram user ID: ${user.id}`);
        return user.id.toString();
      } else {
        setDebugMessage('Данные пользователя недоступны в Telegram Web App');
        return null;
      }
    } else {
      setDebugMessage('Telegram Web App не инициализирован');
      return null;
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      let chatId;

      const telegramUserId = getTelegramUserId();
      if (telegramUserId) {
        chatId = telegramUserId;
      } else {
        const urlChatId = searchParams.get('chat_id');
        if (urlChatId) {
          setDebugMessage(`Chat ID from URL: ${urlChatId}`);
          chatId = urlChatId;
        } else {
          const savedChatId = localStorage.getItem('chat_id');
          if (savedChatId) {
            setDebugMessage(`Chat ID from localStorage: ${savedChatId}`);
            chatId = savedChatId;
          }
        }
      }

      if (!chatId) {
        setDebugMessage('Не удалось определить chat_id');
        setLoading(false);
        return;
      }

      localStorage.setItem('chat_id', chatId);
      setDebugMessage(`Используемый chat_id: ${chatId}`);

      try {
        const response = await axios.get(`${API_BASE_URL}/check_user?chat_id=${chatId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        setDebugMessage(`Ответ бэкенда: isProfileComplete = ${response.data.is_profile_complete}`);
        setUser({ chat_id: chatId, isProfileComplete: response.data.is_profile_complete });
      } catch (error) {
        setDebugMessage(`Ошибка: ${error.message}`);
        setUser({ chat_id: chatId, isProfileComplete: false });
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [searchParams]);

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
        <Route
          path="/"
          element={
            user.isProfileComplete ? (
              <Candidates setSelectedMatch={setSelectedMatch} currentUserChatId={user.chat_id} />
            ) : (
              <ProfileSetup user={user} setUser={setUser} />
            )
          }
        />
        {user.isProfileComplete && (
          <>
            <Route path="/chat" element={<Chat match={selectedMatch} />} />
            <Route path="/profile" element={<Profile chatId={user.chat_id} />} />
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
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active-link' : '')}>
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