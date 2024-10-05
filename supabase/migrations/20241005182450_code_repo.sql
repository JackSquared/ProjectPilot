CREATE TABLE IF NOT EXISTS public.code_repositories(
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    project_id bigint NOT NULL,
    owner_repo text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

ALTER TABLE public.github_repositories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage repositories in their projects" ON code_repositories
    FOR ALL
        USING (project_id IN (
            SELECT
                id
            FROM
                projects
            WHERE
                user_id = auth.uid()))
            WITH CHECK (project_id IN (
                SELECT
                    id
                FROM
                    projects
                WHERE
                    user_id = auth.uid()));

