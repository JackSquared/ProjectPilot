import {publicProcedure, router} from './trpc';
import {inferRouterOutputs} from '@trpc/server';

export const appRouter = router({
  getExample: publicProcedure.query(async () => {
    return [1, 2, 3];
  }),
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
