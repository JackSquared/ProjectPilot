SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.read_secret(secret_name text)
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $$
DECLARE
  secret text;
BEGIN
  IF current_setting('role') != 'service_role' THEN
    RAISE EXCEPTION 'authentication required';
  END IF;
  SELECT
    decrypted_secret
  FROM
    vault.decrypted_secrets
  WHERE
    name = secret_name INTO secret;
  RETURN secret;
END;
$$;

CREATE OR REPLACE FUNCTION public.insert_secret(name text, secret text)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $$
BEGIN
  IF current_setting('role') != 'service_role' THEN
    RAISE EXCEPTION 'authentication required';
  END IF;
  RETURN vault.create_secret(secret, name);
END;
$$;

CREATE FUNCTION delete_secret(secret_name text)
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
BEGIN
  IF current_setting('role') != 'service_role' THEN
    RAISE EXCEPTION 'authentication required';
  END IF;
  RETURN DELETE FROM vault.decrypted_secrets
  WHERE name = secret_name;
END;
$$;

