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

CREATE POLICY "Project owners can manage tasks" ON public.tasks TO public
    USING ((
        SELECT
            user_id::text
        FROM
            public.projects
        WHERE
            id = project_id) =(current_setting('request.jwt.claims', TRUE)::jsonb #>> '{sub}'));

