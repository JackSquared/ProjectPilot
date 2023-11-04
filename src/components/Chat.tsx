'use client';

import { useChat } from 'ai/react';

const openingMessage = `
Hello! I am ProjectPilot, an AI that empowers people to build their ideas.
Let's have a conversation about your idea so that I can get on the same page as you and then we can discuss how we can make it a reality.
I will assume you are starting from a fresh idea so it is best for you to start with a high level concept for your idea.
However, if you have already made decisions about implementation then feel free to give me those details.
`

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({ initialMessages: [{ role: 'assistant', id: '0', content: openingMessage }]});

  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      {messages.length > 0
        ? messages.map(m => (
            <div key={m.id} className="whitespace-pre-wrap">
              <br />
              <strong>{m.role === 'user' ? 'User: ' : 'AI: '}</strong>
              <br />
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
