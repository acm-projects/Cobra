import React from 'react';
import { ChatHistoryItem } from '../../types';

interface PastChatsProps {
  chatHistory: ChatHistoryItem[];
  onSelectChat: (chatTitle: string) => void;
}

const PastChats: React.FC<PastChatsProps> = ({ chatHistory, onSelectChat }) => {
  return (
    <div className="past-chats-section">
      <div className="past-chats-header">
        <span>Past Chats</span>
      </div>
      <div className="past-chats-list">
        {chatHistory.map((chat, index) => (
          <div 
            key={index} 
            className="past-chat-item"
            onClick={() => onSelectChat(chat.title)}
          >
            <i className="fas fa-history"></i>
            <span className="chat-title">{chat.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastChats; 