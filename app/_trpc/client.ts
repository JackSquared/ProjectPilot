import {createTRPCReact} from '@trpc/react-query';
import {type AppRouter} from '@/app/server';

export const api = createTRPCReact<AppRouter>({});
