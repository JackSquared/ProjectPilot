import React, { useState, useEffect } from 'react';

interface MessageProps {
  sender: string;
  content: string;
}

const Message: React.FC<MessageProps> = ({ sender, content }) => {
  return (
    <div>
      <h4>{sender}</h4>
      <p>{content}</p>
    </div>
  );
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { sender: 'User', content: input }]);
    setInput('');
  };

  // simulate AI response
  useEffect(() => {
    if (messages.length && messages[messages.length - 1].sender === 'User') {
      setTimeout(() => {
        setMessages([
          ...messages,
          { sender: 'AI', content: 'This is a simulated AI response.' },
        ]);
      }, 1000);
    }
  }, [messages]);

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <Message
            key={index}
            sender={message.sender}
            content={message.content}
          />
        ))}
      </div>
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(event) => (event.key === 'Enter' ? handleSend() : null)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
