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
        isChatVisible ? 'w-[40vw]' : 'w-[70px]'
      } flex-shrink-0 overflow-hidden fixed bottom-0 right-0`}
    >
      <div className="h-full flex flex-col items-end pr-2 pb-2">
        <Button onClick={toggleChat} className="mb-2 mr-2">
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
