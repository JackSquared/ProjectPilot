import {z} from 'zod';

import {router, protectedProcedure} from '@/app/server/trpc';

export const codeRepositoryRouter = router({
  create: protectedProcedure
    .input(
      z.object({projectId: z.number(), owner: z.string(), repo: z.string()}),
    )
    .mutation(async ({ctx, input}) => {
      const {projectId, owner, repo} = input;
      const owner_repo = `${owner}/${repo}`;
      const {data, error} = await ctx.db
        .from('code_repositories')
        .insert({project_id: projectId, owner_repo});
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
        .maybeSingle();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
});
