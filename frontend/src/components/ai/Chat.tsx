import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { AuthContext } from "../../AuthContext";

interface MessageProps {
  sender: string;
  content: string;
}

const Message: React.FC<MessageProps> = ({ sender, content }) => {
  return (
    <Card sx={{ my: 1 }}>
      <CardContent>
        <Typography variant="h6">{sender}</Typography>
        <Typography variant="body1">{content}</Typography>
      </CardContent>
    </Card>
  );
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "User", content: input }]);
    setInput("");
  };

  // simulate AI response
  useEffect(() => {
    if (messages.length && messages[messages.length - 1].sender === "User") {
      setTimeout(() => {
        setMessages([
          ...messages,
          { sender: "AI", content: "This is a simulated AI response." },
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
      <TextField
        variant="outlined"
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(event) => (event.key === "Enter" ? handleSend() : null)}
      />
      <Button variant="contained" onClick={handleSend}>
        Send
      </Button>
    </div>
  );
};

export default Chat;
