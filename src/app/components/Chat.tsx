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
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch p-4 md:p-8">
      {messages.length > 0
        ? messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <div className="my-2 font-bold">
                {m.role === 'user' ? 'User: ' : 'AI: '}
              </div>
              {m.content}
            </div>
          ))
        : null}

      <form onSubmit={handleSubmit}>
        <input
          className="input fixed max-w-md bottom-0 mb-8 shadow-xl p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
