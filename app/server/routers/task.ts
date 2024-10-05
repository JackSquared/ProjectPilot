import {z} from 'zod';

import {router, protectedProcedure} from '@/app/server/trpc';

export const taskRouter = router({
  getAll: protectedProcedure
    .input(z.object({projectId: z.number()}))
    .query(async ({ctx, input}) => {
      const {data, error} = await ctx.db
        .from('tasks')
        .select('*')
        .eq('project_id', input.projectId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
});
