import { useEffect, useRef } from 'react';
import { Paperclip, Smile, Send } from 'lucide-react';
import Message from '../Message/Message';
import './ChatWindow.scss';

const ChatWindow = ({ messages, onSendMessage, newMessage, setNewMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(newMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(newMessage);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="chat-input-container">
          <input
            type="text"
            placeholder="Type a new message here"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="chat-input"
          />
          
          <div className="chat-input-actions">
            <button type="button" className="action-button">
              <Paperclip size={20} />
            </button>
            <button type="button" className="action-button">
              <Smile size={20} />
            </button>
            <button type="submit" className="send-button" disabled={!newMessage.trim()}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow; 