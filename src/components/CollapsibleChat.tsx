'use client';

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import Chat from '@/components/Chat';
import {BotMessageSquare, X} from 'lucide-react';

export default function CollapsibleChat() {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => setIsChatVisible(!isChatVisible);

  return (
    <div className="fixed bottom-0 right-0 z-50">
      {!isChatVisible && (
        <Button onClick={toggleChat} className="fixed bottom-4 right-4 z-10">
          <BotMessageSquare />
        </Button>
      )}
      <aside
        className={`fixed transition-all duration-300 ease-in-out ${
          isChatVisible
            ? 'bottom-0 right-0 w-full h-[80vh] 2xl:w-[600px] 2xl:h-full transform-none'
            : 'bottom-0 right-0 w-full h-[80vh] 2xl:w-[600px] 2xl:h-full transform translate-y-full'
        } overflow-hidden`}
      >
        {isChatVisible && (
          <Button
            onClick={toggleChat}
            className="absolute top-2 right-2 z-10"
            size="sm"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <div className="h-full">
          <Chat />
        </div>
      </aside>
    </div>
  );
}
