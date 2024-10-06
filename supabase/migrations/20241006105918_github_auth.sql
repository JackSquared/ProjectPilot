CREATE OR REPLACE FUNCTION public.create_new_user()
    RETURNS TRIGGER
    AS $$
DECLARE
    full_name text;
    name_parts text[];
BEGIN
    full_name := NEW.raw_user_meta_data ->> 'full_name';
    name_parts := string_to_array(full_name, ' ');
    INSERT INTO public.users(id, first_name, last_name, email, ROLE)
        VALUES (NEW.id, COALESCE(name_parts[1], ''), COALESCE(array_to_string(name_parts[2:], ' '), ''), NEW.email, CASE WHEN NEW.email IN ('jackdewinter@sent.com', 'osmosis-sugary0x@icloud.com') THEN
                'admin'
            ELSE
                'regular'
            END);
    RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

