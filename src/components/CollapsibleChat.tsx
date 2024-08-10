'use client';

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import Chat from '@/components/Chat';
import {User} from '@supabase/supabase-js';

export default function CollapsibleChat({user}: {user: User}) {
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
          <Chat user={user} />
        </div>
      </div>
    </aside>
  );
}
