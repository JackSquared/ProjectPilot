'use client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {httpBatchLink} from '@trpc/client';
import React, {useState} from 'react';
import {trpc} from './client';
import ReactQueryRewind from 'react-query-rewind';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

export default function TRPCProvider({children}: {children: React.ReactNode}) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({url: `/api/trpc`})],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryRewind />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
