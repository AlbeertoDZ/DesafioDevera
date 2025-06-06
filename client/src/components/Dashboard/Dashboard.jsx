import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import './Dashboard.scss';

const Dashboard = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '¡Bienvenido! Soy el asistente de Devera y voy a ayudarte con la información que necesitamos para empezar. Para empezar dime la web de tu empresa.',
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'bot',
      content: 'Rephrase: This is an ai chatbot generated for better communication and simpler work flow.',
      timestamp: new Date()
    },
    {
      id: 3,
      type: 'bot',
      content: 'This AI chatbot has been developed to optimize communication and simplify work processes, ultimately leading to smoother operations.',
      timestamp: new Date()
    },
    {
      id: 4,
      type: 'user',
      content: 'Thank You :)',
      timestamp: new Date()
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (message) => {
    if (message.trim()) {
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        content: message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Simular respuesta del bot después de un delay
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: 'Gracias por tu mensaje. ¿En qué más puedo ayudarte?',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="dashboard-main">
          <ChatWindow 
            messages={messages}
            onSendMessage={handleSendMessage}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 