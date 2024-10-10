'use client';

import React, {useRef, useEffect, useState} from 'react';
import {useChat} from 'ai/react';
import {motion, AnimatePresence} from 'framer-motion';
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
import {
  Copy,
  User,
  Bot,
  Square,
  RotateCw,
  Maximize2,
  Minimize2,
  MessageCircle,
  X,
} from 'lucide-react';
import {ToolInvocation} from 'ai';
import {usePathname, useRouter} from 'next/navigation';
import ConnectedRepository from './ConnectedRepository';
import {useMediaQuery} from 'react-responsive';
import {cn} from '@/lib/utils';
import {api} from '@/app/_trpc/client';

interface ScrollableElement extends Element {
  scrollTimeout?: number;
}

interface CombinedChatProps {
  providerToken: string | null;
}

export default function Chat({providerToken}: CombinedChatProps) {
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [lastHeight, setLastHeight] = useState<number | null>(null);
  const [chatState, setChatState] = useState<'minimized' | 'expanded'>(
    'minimized',
  );
  const [isNavigating, setIsNavigating] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);

  const isMobile = useMediaQuery({maxWidth: 1240});

  const pathname = usePathname();
  const router = useRouter();

  const isProjectPage = /^\/projects\/[^/]+$/.test(pathname);
  const projectId = pathname.split('/')[2];

  const {refetch: refetchTasks} = api.task.getAll.useQuery({
    projectId: parseInt(projectId),
  });

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    addToolResult,
    setInput,
  } = useChat({
    api: isProjectPage && projectId ? `/api/chat/${projectId}` : '/api/chat',
    maxSteps: 3,
    async onToolCall({toolCall}) {
      if (toolCall.toolName === 'openProject') {
        const {id} = toolCall.args as {id: string};
        setIsNavigating(true);
        setChatState('expanded');
        setTimeout(() => {
          router.push(`/projects/${id}`);
        }, 300);
        return 'Project opened';
      }
      if (toolCall.toolName === 'addTask') {
        refetchTasks();
      }
    },
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
    }
  }, [messages, isUserScrolling, lastHeight]);

  useEffect(() => {
    if (isProjectPage) {
      setChatState(isMobile ? 'minimized' : 'expanded');
      setIsChatVisible(true);
    } else {
      setChatState('minimized');
    }
  }, [pathname, isNavigating, isProjectPage, isMobile]);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollElement = event.target as HTMLDivElement;
    if (scrollElement.scrollTop === 0 && scrollRef.current) {
      const {scrollHeight} = scrollRef.current;
      setLastHeight(scrollHeight);
    }
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    setIsUserScrolling(true);

    const target = event.currentTarget as ScrollableElement;
    clearTimeout(target.scrollTimeout);
    target.scrollTimeout = window.setTimeout(() => {
      setIsUserScrolling(false);
    }, 150);
  };

  const expandChat = () => {
    if (!isMobile) {
      setChatState('expanded');
    }
  };

  const minimizeChat = () => {
    setChatState('minimized');
  };

  const toggleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
    if (isChatVisible) {
      setChatState('minimized');
    }
  };

  const promptPillText = isProjectPage
    ? 'Help me come up with a plan and help me define some tasks to work on.'
    : 'Shazam for vinyl covers. Take a photo of a cover and have it added to your discogs list.';

  const handlePromptPillClick = () => {
    setInput(promptPillText);
    handleSubmit(new Event('submit'));
  };

  const filteredMessages = messages.filter((m) => m.role !== 'system');

  const variants = {
    minimized: {
      width: isMobile ? '100%' : '25vw',
      height: '50vh',
      opacity: 1,
      scale: 1,
      x: isMobile ? '-50%' : 0,
      y: 0,
    },
    expanded: {
      width: '50vw',
      height: '92vh',
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <div className="">
      <AnimatePresence>
        {isChatVisible && (
          <motion.div
            layout
            initial={
              chatState === 'minimized' ? variants.minimized : variants.expanded
            }
            animate={
              chatState === 'minimized' ? variants.minimized : variants.expanded
            }
            exit={{opacity: 0, scale: 0.8, x: '100%', y: '100%'}}
            transition={{type: 'spring', stiffness: 300, damping: 30}}
            className={cn(
              'fixed bottom-0 bg-zinc-900 rounded-lg shadow-lg overflow-hidden flex border-2 border-primary/10',
              isMobile
                ? 'left-1/2 w-[98%]'
                : chatState === 'expanded'
                ? 'right-0 w-1/2'
                : 'right-0 w-1/4',
            )}
            style={{
              maxWidth: isMobile
                ? '98%'
                : chatState === 'expanded'
                ? 'calc(100vw - 2rem)'
                : '50rem',
              minWidth: isMobile
                ? 'auto'
                : chatState === 'minimized'
                ? '30rem'
                : 'auto',
              transformOrigin: isMobile ? 'bottom center' : 'bottom right',
            }}
          >
            <Card className="w-full h-full flex flex-col rounded-none border-0">
              <CardHeader className="border-b border-border/20">
                <CardTitle className="text-2xl font-semibold text-primary flex justify-between items-center">
                  Project Assistant
                  <div className="flex space-x-2">
                    {chatState === 'expanded' && !isProjectPage ? (
                      <Button
                        onClick={minimizeChat}
                        size="icon"
                        variant="ghost"
                      >
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <>
                        {!isMobile && !isProjectPage && (
                          <Button
                            onClick={expandChat}
                            size="icon"
                            variant="ghost"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                    {(isMobile || !isProjectPage) && (
                      <Button
                        onClick={toggleChatVisibility}
                        size="icon"
                        variant="ghost"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
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
                    <div className="absolute inset-0 flex flex-col items-center justify-between p-6">
                      <div className="flex-grow flex items-center justify-center">
                        <p className="text-xl text-muted-foreground">
                          What do you want to work on?
                        </p>
                      </div>
                      <Button
                        onClick={handlePromptPillClick}
                        variant="secondary"
                        className="rounded-full px-4 py-2 text-sm mt-4 hover:bg-zinc-700"
                      >
                        {promptPillText}
                      </Button>
                    </div>
                  ) : (
                    filteredMessages.map((m, index) => (
                      <>
                        {!m.toolInvocations && (
                          <Card
                            key={m.id}
                            className="mb-4 w-full shadow-md bg-zinc-800"
                          >
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
                                    {m.content && (
                                      <Markdown
                                        components={{
                                          code({
                                            className,
                                            children,
                                            ...props
                                          }) {
                                            const match = /language-(\w+)/.exec(
                                              className || '',
                                            );
                                            const codeString = String(
                                              children,
                                            ).replace(/\n$/, '');
                                            return match ? (
                                              <div className="relative my-4">
                                                <SyntaxHighlighter
                                                  // @ts-expect-error - no types for react-syntax-highlighter
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
                                                    navigator.clipboard.writeText(
                                                      codeString,
                                                    )
                                                  }
                                                />
                                              </div>
                                            ) : (
                                              <code
                                                className={className}
                                                {...props}
                                              >
                                                {children}
                                              </code>
                                            );
                                          },
                                        }}
                                      >
                                        {m.content}
                                      </Markdown>
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
                        )}
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
                                          projectId={parseInt(projectId)}
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
                      </>
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
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <span className="sr-only">Send</span>
                    </Button>
                  )}
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        {!isChatVisible && (
          <Button
            onClick={toggleChatVisibility}
            size="icon"
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg fixed bottom-4 right-4 border-2 border-primary-foreground"
          >
            <Bot className="h-6 w-6 text-primary-foreground" />
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}
