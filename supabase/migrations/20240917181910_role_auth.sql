CREATE OR REPLACE FUNCTION public.set_user_role(event jsonb)
    RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
    claims jsonb;
    user_email text;
BEGIN
    -- Log the entire event object
    RAISE LOG 'Full event object: %', event;
    -- Get the user's email
    user_email := event -> 'claims' ->> 'email';
    -- Log the user's email
    RAISE LOG 'User email: %', user_email;
    claims := coalesce(event -> 'claims', '{}'::jsonb);
    -- Check if 'app_metadata' exists in claims
    IF jsonb_typeof(claims -> 'app_metadata') IS NULL THEN
        claims := jsonb_set(claims, '{app_metadata}', '{}');
    END IF;
    -- Set a claim of 'admin' if the email matches, otherwise 'regular'
    IF user_email = 'jackdewinter@sent.com' THEN
        claims := jsonb_set(claims, '{app_metadata, role}', '"admin"');
        -- Log the role being set
        RAISE LOG 'Setting role to admin for email: %', user_email;
    ELSE
        claims := jsonb_set(claims, '{app_metadata, role}', '"regular"');
        -- Log the role being set
        RAISE LOG 'Setting role to regular for email: %', user_email;
    END IF;
    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);
    -- Log the final event object
    RAISE LOG 'Final event object: %', event;
    RETURN event;
END;
$$;

-- Set permissions for the function
GRANT usage ON SCHEMA public TO supabase_auth_admin;

GRANT EXECUTE ON FUNCTION public.set_user_role TO supabase_auth_admin;

REVOKE EXECUTE ON FUNCTION public.set_user_role FROM authenticated, anon, public;

CREATE TABLE public.users(
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'regular'
);

CREATE OR REPLACE FUNCTION public.create_new_user()
    RETURNS TRIGGER
    AS $$
BEGIN
    INSERT INTO public.users(id, first_name, last_name, email, ROLE)
        VALUES(NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name', NEW.email, CASE WHEN NEW.email = 'jackdewinter@sent.com' THEN
                'admin'
            ELSE
                'regular'
            END);
    RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_new_user();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow only admin access to the users table" ON public.users
    FOR ALL
        USING (current_setting('request.jwt.claims', TRUE)::jsonb #>> '{app_metadata, role}' = 'admin');

ALTER TABLE ONLY "public"."projects"
    DROP CONSTRAINT "projects_user_id_fkey";

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

