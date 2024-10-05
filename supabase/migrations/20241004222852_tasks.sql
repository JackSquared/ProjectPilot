CREATE TABLE IF NOT EXISTS public.tasks(
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    project_id bigint NOT NULL,
    title text NOT NULL,
    description text,
    status text CHECK (status IN ('to do', 'doing', 'done')) NOT NULL DEFAULT 'to do',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage tasks in their projects" ON tasks
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

