import {useQuery} from '@tanstack/react-query';
import {Octokit} from 'octokit';
import {Endpoints} from '@octokit/types';

export type Repository =
  Endpoints['GET /repos/{owner}/{repo}']['response']['data'];

export type Repositories = Repository[];

async function fetchGithubRepos(providerToken: string): Promise<Repositories> {
  const octokit = new Octokit({auth: providerToken});
  const {data: repos} = await octokit.rest.repos.listForAuthenticatedUser();

  return repos;
}

async function fetchGithubUser(providerToken: string) {
  const octokit = new Octokit({auth: providerToken});
  const {data: user} = await octokit.rest.users.getAuthenticated();
  return user;
}

export function useGithubUser(providerToken: string | null) {
  return useQuery({
    queryKey: ['githubUser', providerToken],
    queryFn: () => fetchGithubUser(providerToken!),
    enabled: !!providerToken,
  });
}

export function useGithubRepos(providerToken: string | null) {
  return useQuery<Repositories, Error>({
    queryKey: ['githubRepos', providerToken],
    queryFn: () => fetchGithubRepos(providerToken!),
    enabled: !!providerToken,
  });
}
