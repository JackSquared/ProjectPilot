'use client';

import React, {useState, useEffect} from 'react';
import {Octokit} from 'octokit';
import {formatDistanceToNow} from 'date-fns';
import Link from 'next/link';
import {api} from '@/app/_trpc/client';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {Check, ChevronsUpDown} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Repository, useGithubRepos, useGithubUser} from '@/hooks/useGitHub';

type ConnectedGitHubRepoProps = {
  projectId: number;
  providerToken: string | null;
};

export default function ConnectedRepository({
  projectId,
  providerToken,
}: ConnectedGitHubRepoProps) {
  const [lastCommit, setLastCommit] = useState<string | null>(null);
  const [openIssues, setOpenIssues] = useState<number | null>(null);
  const [pullRequests, setPullRequests] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [open, setOpen] = useState(false);

  const {mutate: createCodeRepository} =
    api.codeRepository.create.useMutation();

  const {data: codeRepository} = api.codeRepository.getLatest.useQuery({
    projectId: projectId,
  });

  const {
    data: githubUser,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useGithubUser(providerToken);
  const {
    data: githubRepos,
    isLoading: isLoadingRepos,
    error: errorRepos,
  } = useGithubRepos(providerToken);

  useEffect(() => {
    const updateRepoDetails = async (repo: Repository) => {
      const octokit = new Octokit({auth: providerToken});
      try {
        const repoDetails = await fetchRepoDetails(
          octokit,
          repo.owner.login,
          repo.name,
        );
        setLastCommit(repoDetails.lastCommit);
        setOpenIssues(repoDetails.openIssues);
        setPullRequests(repoDetails.pullRequests);
        setLastUpdated(new Date(repo.updated_at));
      } catch (error) {
        console.error('Error fetching repo details:', error);
      }
    };

    if (codeRepository && githubRepos) {
      const repo = githubRepos?.find(
        (repo) => repo.full_name === codeRepository.full_name,
      );
      if (providerToken && repo) {
        setSelectedRepo(repo);
        updateRepoDetails(repo);
      }
    }
  }, [codeRepository, githubRepos, providerToken]);

  async function fetchRepoDetails(
    octokit: Octokit,
    owner: string,
    repo: string,
  ) {
    try {
      const [commitsResponse, issuesResponse, pullsResponse] =
        await Promise.all([
          octokit.rest.repos.listCommits({owner, repo, per_page: 1}),
          octokit.rest.issues.listForRepo({owner, repo, state: 'open'}),
          octokit.rest.pulls.list({owner, repo, state: 'open'}),
        ]);

      return {
        lastCommit: commitsResponse.data[0]?.commit.message || 'No commits',
        openIssues: issuesResponse.data.length,
        pullRequests: pullsResponse.data.length,
      };
    } catch (error) {
      console.error('Error fetching repo details:', error);
      throw error;
    }
  }

  const handleRepoSelect = async (repoInput: Repository) => {
    setSelectedRepo(repoInput);
    setOpen(false);

    const repo = githubRepos?.find(
      (repo) => repo.full_name === repoInput.full_name,
    );
    if (repo) {
      createCodeRepository({
        projectId: projectId,
        owner: repo.owner.login,
        repo: repo.name,
      });

      if (providerToken) {
        const octokit = new Octokit({auth: providerToken});
        try {
          const repoDetails = await fetchRepoDetails(
            octokit,
            repo.owner.login,
            repo.name,
          );
          setLastCommit(repoDetails.lastCommit);
          setOpenIssues(repoDetails.openIssues);
          setPullRequests(repoDetails.pullRequests);
          setLastUpdated(new Date(repo.updated_at));
        } catch (error) {
          console.error('Error fetching repo details:', error);
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected GitHub Repository</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                disabled={isLoadingRepos}
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedRepo ? selectedRepo.full_name : 'Select a repository'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" side="bottom">
              <Command>
                <CommandInput placeholder="Search repository..." />
                <CommandList className="max-h-[200px] overflow-y-auto">
                  <CommandEmpty>No repository found.</CommandEmpty>
                  <CommandGroup>
                    {isLoadingRepos ? (
                      <CommandItem>Loading repositories...</CommandItem>
                    ) : errorRepos ? (
                      <CommandItem>
                        Error loading repositories. Please try again.
                      </CommandItem>
                    ) : githubRepos && githubRepos.length > 0 ? (
                      githubRepos.map((repo) => (
                        <CommandItem
                          key={repo.id}
                          onSelect={() => handleRepoSelect(repo)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedRepo?.full_name === repo.full_name
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {repo.full_name}
                        </CommandItem>
                      ))
                    ) : (
                      <CommandItem>No repositories found.</CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {selectedRepo && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    {isLoadingUser ? (
                      <AvatarFallback>...</AvatarFallback>
                    ) : errorUser ? (
                      <AvatarFallback>!</AvatarFallback>
                    ) : githubUser ? (
                      <AvatarImage
                        src={`https://github.com/${selectedRepo.owner.login}.png`}
                        alt={`${selectedRepo.owner.login}'s GitHub Avatar`}
                      />
                    ) : (
                      <AvatarFallback>GH</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedRepo.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last updated:{' '}
                      {lastUpdated
                        ? formatDistanceToNow(lastUpdated, {
                            addSuffix: true,
                          })
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
                <Link
                  href={`https://github.com/${selectedRepo.full_name}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button variant="outline">View Repository</Button>
                </Link>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Latest commit:</span>{' '}
                  {lastCommit}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Open issues:</span>{' '}
                  {openIssues}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Pull requests:</span>{' '}
                  {pullRequests}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
