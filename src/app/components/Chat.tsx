'use client';

import {useChat} from 'ai/react';
import {useEffect, useRef} from 'react';

const openingMessage =
  "Hello and welcome to ProjectPilot! Think of me as your personal AI assistant, ready to help whether you're starting a new project, looking to advance an existing one, or in the mood to brainstorm possibilities. Tell me where you are in your creative process or project development, and I'll provide the tailored support you need. Are we charting new territory today, carrying on with our progress, or sparking new ideas?";

export default function Chat() {
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    initialMessages: [{role: 'assistant', id: '0', content: openingMessage}],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages]);

  return (
    <div className="mx-auto w-full max-w-md flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4 mb-4">
        {messages.length > 0 &&
          messages.map((m, index) => (
            <div key={m.id} className="whitespace-pre-wrap my-2">
              <div className="font-bold">
                {m.role === 'user' ? 'User: ' : 'AI: '}
              </div>
              {m.content}
              {index === messages.length - 1 ? (
                <div ref={messagesEndRef} />
              ) : null}
            </div>
          ))}
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="input w-full shadow-xl p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
