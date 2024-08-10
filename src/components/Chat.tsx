'use client';

import React from 'react';
import {useChat} from 'ai/react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import Markdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {Copy} from 'lucide-react';

const systemMessage = `You are ProjectPilot, an AI that empowers people to build their ideas.
When you write markdown code blocks, always ensure there is a new line between the code block and the text preceding it.`;

const openingMessage = `Hello! I am ProjectPilot, an AI that empowers people to build their ideas.
Let's have a conversation about your idea so that I can get on the same page as you and then we can discuss how we can make it a reality.
I will assume you are starting from a fresh idea so it is best for you to start with a high level concept for your idea.
However, if you have already made decisions about implementation then feel free to give me those details.`;

export default function Chat() {
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    initialMessages: [
      {role: 'system', id: '0', content: systemMessage},
      {role: 'assistant', id: '1', content: openingMessage},
    ],
  });

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Project Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {messages.map((m) => {
            if (m.role === 'system') return null;

            return (
              <div
                key={m.id}
                className={`flex ${
                  m.role === 'user' ? 'justify-start' : 'justify-center'
                } mb-4`}
              >
                {m.role === 'user' ? (
                  <div className="flex flex-row items-start">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="mx-2 p-3 rounded-lg bg-primary text-primary-foreground flex-grow">
                      <Markdown
                        components={{
                          code({className, children, ...props}) {
                            const match = /language-(\w+)/.exec(
                              className || '',
                            );
                            const codeString = String(children).replace(
                              /\n$/,
                              '',
                            );
                            return match ? (
                              <div className="relative">
                                <SyntaxHighlighter
                                  // @ts-expect-error style
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {codeString}
                                </SyntaxHighlighter>
                                <Copy
                                  className="absolute top-2 right-2 cursor-pointer"
                                  onClick={() =>
                                    navigator.clipboard.writeText(codeString)
                                  }
                                />
                              </div>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {m.content}
                      </Markdown>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-secondary w-full">
                    <Markdown
                      components={{
                        code({className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          const codeString = String(children).replace(
                            /\n$/,
                            '',
                          );
                          return match ? (
                            <div className="relative">
                              <SyntaxHighlighter
                                // @ts-expect-error style
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {codeString}
                              </SyntaxHighlighter>
                              <Copy
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() =>
                                  navigator.clipboard.writeText(codeString)
                                }
                              />
                            </div>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {m.content}
                    </Markdown>
                  </div>
                )}
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            className="flex-grow"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
