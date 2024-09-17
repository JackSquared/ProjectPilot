'use client';

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import Chat from '@/components/Chat';
import {User} from '@supabase/supabase-js';
import {BotMessageSquare, X as CloseIcon} from 'lucide-react';

export default function CollapsibleChat({user}: {user: User}) {
  const [isChatVisible, setIsChatVisible] = useState(true);

  const toggleChat = () => setIsChatVisible(!isChatVisible);

  return (
    <aside
      className={`${
        isChatVisible
          ? 'w-full md:w-[60vw] xl:w-[70vw] max-w-[800px]'
          : 'w-[80px]'
      } h-[60vh] flex-shrink-0 overflow-hidden fixed bottom-0 right-0 `}
    >
      <div className="h-full flex flex-col items-end pr-2 pb-2">
        {!isChatVisible && (
          <Button
            onClick={toggleChat}
            className="mb-2 mr-2 absolute bottom-4 right-2"
          >
            <BotMessageSquare className="w-6 h-6 scale-x-[-1]" />
          </Button>
        )}
        {isChatVisible && (
          <Button
            onClick={toggleChat}
            className="absolute top-6 right-8 z-10"
            size="sm"
            variant="ghost"
          >
            <CloseIcon className="h-4 w-4" />
          </Button>
        )}
        <div
          className={`flex-grow overflow-auto p-4 ${
            isChatVisible ? '' : 'hidden'
          }`}
        >
          <div className="w-full h-full">
            <Chat user={user} />
          </div>
        </div>
      </div>
    </aside>
  );
}
