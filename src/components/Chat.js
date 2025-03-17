import React, { useState } from 'react';

function Chat({ matches = [] }) {  // Устанавливаем значение по умолчанию
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectMatch = (match) => {
    setSelectedChat(match);
  };
  console.log('Current matches in App:', matches); // Отладка
  return (
    <div className="chat">
      <h2>Ваши матчи</h2>
      {!matches.length ? (
        <p>У вас пока нет мэтчей</p>
      ) : (
        <div className="matches-list">
          {matches.map((match) => (
            <div
              key={match.chat_id}
              className="match-card"
              onClick={() => handleSelectMatch(match)}
              style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', margin: '5px' }}
            >
              {match.photo && (
                <img
                  src={`data:image/jpeg;base64,${match.photo}`}
                  alt={match.name}
                  style={{ maxWidth: '50px', borderRadius: '5px' }}
                />
              )}
              <span>{match.name}</span>
            </div>
          ))}
        </div>
      )}
      {selectedChat && (
        <div className="chat-window">
          <h3>Чат с {selectedChat.name}</h3>
          <p>Здесь будет чат (в будущем добавим сообщения)</p>
        </div>
      )}
    </div>
  );
}

export default Chat;