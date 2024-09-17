import {createClient} from '@/lib/supabase/server';
import {redirect} from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardHeader,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {logout} from '../actions/auth';

export default async function Profile() {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <Card className="container mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <code className="highlight">{user.email}</code>
        <div className="heading">Last Signed In:</div>
        <code className="highlight">
          {new Date(user.last_sign_in_at || Date.now()).toUTCString()}
        </code>
      </CardContent>
      <CardFooter className="flex justify-between">
        <form action={logout}>
          <Button type="submit">Logout</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
