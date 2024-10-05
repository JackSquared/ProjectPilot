import {codeRepositoryRouter} from './routers/code_repository';
import {taskRouter} from './routers/task';
import {publicProcedure, router} from './trpc';
import {inferRouterOutputs} from '@trpc/server';

export const appRouter = router({
  getExample: publicProcedure.query(async () => {
    return [1, 2, 3];
  }),
  task: taskRouter,
  codeRepository: codeRepositoryRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
