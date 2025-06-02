import './Message.scss';

const Message = ({ message }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message ${message.type}`}>
      <div className="message-avatar">
        {message.type === 'bot' ? (
          <div className="bot-avatar">
            <span>d.</span>
          </div>
        ) : (
          <div className="user-avatar">
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616b612b12c?w=32&h=32&fit=crop&crop=face" 
              alt="User" 
            />
          </div>
        )}
      </div>
      
      <div className="message-content">
        <div className="message-bubble">
          <p className="message-text">{message.content}</p>
        </div>
        <div className="message-time">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Message; 