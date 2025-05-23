'use client';

import React, {useRef, useEffect, useState} from 'react';
import {useChat} from 'ai/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Input} from '@/components/ui/input';
import {Send, Copy, User, Bot, Square, RotateCw} from 'lucide-react';
import Markdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {Database} from '@/lib/supabase.types';
import {ToolInvocation} from 'ai';
import {LoadingSpinner} from './icons/LoadingSpinner';
import ConnectedRepository from './ConnectedRepository';

interface ScrollableElement extends Element {
  scrollTimeout?: number;
}

interface ProjectChatProps {
  project: Database['public']['Tables']['projects']['Row'] | null;
  providerToken: string | null;
}

export default function ProjectChat({
  project,
  providerToken,
}: ProjectChatProps) {
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [lastHeight, setLastHeight] = useState<number | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    addToolResult,
  } = useChat({
    api: `/api/chat/${project?.id}`,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const {scrollTop, scrollHeight, clientHeight} = scrollElement;
    if (!lastHeight) {
      scrollElement.scrollTop = scrollHeight;
      return;
    }

    if (!isUserScrolling && scrollTop + clientHeight >= scrollHeight - 100) {
      scrollElement.scrollTop = scrollHeight;
      return;
    }
  }, [messages, isUserScrolling, lastHeight]);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollElement = event.target as HTMLDivElement;
    if (scrollElement.scrollTop === 0 && scrollRef.current) {
      const {scrollHeight} = scrollRef.current;
      setLastHeight(scrollHeight);
    }
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    setIsUserScrolling(true);

    // debounce
    const target = event.currentTarget as ScrollableElement;
    clearTimeout(target.scrollTimeout);
    target.scrollTimeout = window.setTimeout(() => {
      setIsUserScrolling(false);
    }, 150);
  };

  const filteredMessages = messages.filter((m) => m.role !== 'system');

  return (
    <Card className="h-full rounded-none border-0 flex flex-col bg-zinc-900">
      <CardHeader className="border-b border-border/20">
        <CardTitle className="text-2xl font-semibold text-primary">
          Project Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden flex flex-col relative">
        <ScrollArea
          className="flex-grow p-6"
          onScroll={onScroll}
          onWheel={onWheel}
          ref={scrollRef}
        >
          {filteredMessages.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xl text-muted-foreground">
                What do you want to work on?
              </p>
            </div>
          ) : (
            filteredMessages.map((m, index) => (
              <Card key={m.id} className="mb-4 w-full shadow-md bg-zinc-800">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <Avatar className="w-8 h-8 shadow-sm flex-shrink-0">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {m.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="rounded-lg text-zinc-100 mt-1">
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
                                <div className="relative my-4">
                                  <SyntaxHighlighter
                                    //@ts-expect-error ignore
                                    style={vscDarkPlus}
                                    wrapLongLines
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {codeString}
                                  </SyntaxHighlighter>
                                  <Copy
                                    className="absolute top-2 right-2 cursor-pointer text-zinc-400 hover:text-zinc-200"
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
                        {m.toolInvocations?.map(
                          (toolInvocation: ToolInvocation) => {
                            const toolCallId = toolInvocation.toolCallId;
                            const addResult = (result: string) =>
                              addToolResult({toolCallId, result});

                            if (
                              toolInvocation.toolName ===
                              'connectGitHubRepository'
                            ) {
                              return (
                                <div key={toolCallId}>
                                  {toolInvocation.args.message}
                                  <div>
                                    {'result' in toolInvocation ? (
                                      <b>{toolInvocation.result}</b>
                                    ) : (
                                      <div className="mt-4">
                                        <ConnectedRepository
                                          projectId={project?.id ?? 0}
                                          providerToken={providerToken}
                                          onSelect={addResult}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                            if (toolInvocation.toolName === 'updateProject') {
                              return (
                                <div
                                  className="p-3 rounded-lg text-center w-full"
                                  key={toolInvocation.toolCallId}
                                >
                                  {'result' in toolInvocation && (
                                    <>
                                      <p>
                                        <b>Name:</b>{' '}
                                        {toolInvocation.result.name}
                                      </p>
                                      <p>
                                        <b>Description:</b>{' '}
                                        {toolInvocation.result.description}
                                      </p>
                                    </>
                                  )}
                                </div>
                              );
                            }
                            if (toolInvocation.toolName === 'addTask') {
                              return (
                                <div
                                  className="p-3 rounded-lg text-center w-full"
                                  key={toolInvocation.toolCallId}
                                >
                                  {'result' in toolInvocation && (
                                    <>
                                      <p>
                                        <b>Title:</b>{' '}
                                        {toolInvocation.result.title}
                                      </p>
                                      <p>
                                        <b>Description:</b>{' '}
                                        {toolInvocation.result.description}
                                      </p>
                                      <p>
                                        <b>Status:</b>{' '}
                                        {toolInvocation.result.status}
                                      </p>
                                    </>
                                  )}
                                </div>
                              );
                            }
                            if (toolInvocation.toolName === 'updateTechStack') {
                              return (
                                <div
                                  className="p-3 rounded-lg text-center w-full"
                                  key={toolInvocation.toolCallId}
                                >
                                  {'result' in toolInvocation && (
                                    <>
                                      {toolInvocation.result.server_tags &&
                                        toolInvocation.result.server_tags
                                          .length > 0 && (
                                          <p>
                                            <b>Server Tags:</b>{' '}
                                            {toolInvocation.result.server_tags}
                                          </p>
                                        )}
                                      {toolInvocation.result.client_tags &&
                                        toolInvocation.result.client_tags
                                          .length > 0 && (
                                          <p>
                                            <b>Client Tags:</b>{' '}
                                            {toolInvocation.result.client_tags}
                                          </p>
                                        )}
                                      {toolInvocation.result.ops_tags &&
                                        toolInvocation.result.ops_tags.length >
                                          0 && (
                                          <p>
                                            <b>DevOps Tags:</b>{' '}
                                            {toolInvocation.result.ops_tags}
                                          </p>
                                        )}
                                    </>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          },
                        )}
                      </div>
                    </div>
                  </div>
                  {m.role === 'assistant' &&
                    index === filteredMessages.length - 1 && (
                      <div className="flex justify-end mt-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full hover:bg-zinc-700"
                          onClick={() => reload()}
                        >
                          <RotateCw className="h-4 w-4 text-primary" />
                          <span className="sr-only">Reload</span>
                        </Button>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t border-border/20">
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            className="flex-grow bg-zinc-800 border-0 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-full text-zinc-100"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          {isLoading ? (
            <div className="flex space-x-2 items-center">
              <LoadingSpinner className="h-5 w-5 text-primary" />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-zinc-700"
                onClick={() => stop()}
              >
                <Square className="h-5 w-5 text-primary" />
                <span className="sr-only">Stop</span>
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-zinc-700"
            >
              <Send className="h-5 w-5 text-primary" />
              <span className="sr-only">Send</span>
            </Button>
          )}
        </form>
      </CardFooter>
    </Card>
  );
}
