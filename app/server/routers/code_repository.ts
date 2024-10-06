import {z} from 'zod';

import {router, protectedProcedure} from '@/app/server/trpc';

export const codeRepositoryRouter = router({
  create: protectedProcedure
    .input(
      z.object({projectId: z.number(), owner: z.string(), repo: z.string()}),
    )
    .mutation(async ({ctx, input}) => {
      const {projectId, owner, repo} = input;
      const full_name = `${owner}/${repo}`;
      const {data, error} = await ctx.db
        .from('code_repositories')
        .insert({project_id: projectId, full_name});
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),

  getLatest: protectedProcedure
    .input(z.object({projectId: z.number()}))
    .query(async ({ctx, input}) => {
      const {projectId} = input;
      const {data, error} = await ctx.db
        .from('code_repositories')
        .select('*')
        .eq('project_id', projectId)
        .limit(1)
        .maybeSingle();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
});
