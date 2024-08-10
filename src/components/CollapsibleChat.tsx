'use client';

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import Chat from '@/components/Chat';

export default function CollapsibleChat() {
  const [isChatVisible, setIsChatVisible] = useState(true);

  const toggleChat = () => setIsChatVisible(!isChatVisible);

  return (
    <aside
      className={`${
        isChatVisible ? 'w-[40vw]' : 'w-[40px]'
      } flex-shrink-0 overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        <Button onClick={toggleChat} className="self-start">
          {isChatVisible ? '>' : '<'}
        </Button>
        <div
          className={`flex-grow overflow-auto p-4 ${
            isChatVisible ? '' : 'hidden'
          }`}
        >
          <Chat />
        </div>
      </div>
    </aside>
  );
}
