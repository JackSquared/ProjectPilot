import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardHeader,
} from '@/components/ui/card';

import SignOut from '@/components/Auth/SignOut';

export default async function Profile() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({cookies: () => cookieStore});

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
        <SignOut />
      </CardFooter>
    </Card>
  );
}
