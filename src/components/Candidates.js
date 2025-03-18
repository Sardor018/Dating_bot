import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_TOKEN;

function Candidates({ setSelectedMatch, currentUserChatId }) {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);

  const fetchCandidates = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/candidates?chat_id=${currentUserChatId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      setCandidates(data);
    } catch (error) {
      console.error('Ошибка загрузки кандидатов:', error.response?.data || error.message);
    }
  }, [currentUserChatId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);
  console.log('Current matches in App:', matches); // Отладка
  const sendTelegramMessage = async (chatId, message) => {
    try {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: message,
      });
    } catch (error) {
      console.error('Ошибка отправки сообщения в Telegram:', error);
    }
  };

  const handleAction = async (isLike = false) => {
    const currentCandidate = candidates[currentIndex];
    console.log('Current candidate:', currentCandidate);
    if (!currentCandidate) return;
  
    if (isLike) {
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/like`,
          { chat_id: currentUserChatId, target_chat_id: currentCandidate.chat_id },
          { headers: { 'ngrok-skip-browser-warning': 'true' } }
        );
        console.log('Like response:', data);
        if (data.match) {
          setMatches((prev) => {
            // Защита от undefined
            const safePrev = prev || [];
            const newMatches = [...safePrev, currentCandidate];
            console.log('Updated matches:', newMatches);
            return newMatches;
          });
          setSelectedMatch(currentCandidate);
          const matchMessage = `Взаимный лайк с ${currentCandidate.name}! Перейди в чат!`;
          alert(matchMessage);
          await Promise.all([
            sendTelegramMessage(currentCandidate.chat_id, matchMessage),
            sendTelegramMessage(currentUserChatId, matchMessage),
          ]);
        }
      } catch (error) {
        console.error('Ошибка при лайке:', error.response?.data || error.message);
      }
    }
    nextCandidate();
  };

  const nextCandidate = () => {
    setCurrentIndex((prev) => (prev < candidates.length - 1 ? prev + 1 : candidates.length));
  };

  if (!candidates.length) return <div>Кандидаты закончились или ещё не зарегистрированы!</div>;

  const currentCandidate = candidates[currentIndex];
  if (!currentCandidate) return <div>Нет данных кандидата</div>;

  return (
    <div className="candidates">
      <h2>Кандидат</h2>
      <div className="candidate-card">
        {currentCandidate.photo && (
          <img
            src={`data:image/jpeg;base64,${currentCandidate.photo}`}
            alt={currentCandidate.name}
            style={{ maxWidth: '200px', borderRadius: '5px' }}
          />
        )}
        <h3>{currentCandidate.name}</h3>
        <p>{currentCandidate.bio}</p>
        <div className="buttons">
          <button onClick={() => handleAction(false)}>Дизлайк</button>
          <button onClick={() => handleAction(true)}>Лайк</button>
        </div>
      </div>
    </div>
  );
}

export default Candidates;