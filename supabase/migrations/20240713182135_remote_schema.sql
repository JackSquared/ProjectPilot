create policy "User can update their projects"
on "public"."projects"
as permissive
for update
to public
using ((auth.uid() = user_id));



