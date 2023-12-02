import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Card, CardContent, CardFooter, CardTitle} from '@/components/ui/card';

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
    <Card>
      <CardTitle>User Profile</CardTitle>
      <CardContent>
        <code className="highlight">{user.email}</code>
        <div className="heading">Last Signed In:</div>
        <code className="highlight">
          {new Date(user.last_sign_in_at || Date.now()).toUTCString()}
        </code>
        <CardFooter className="flex justify-between">
          <Link className="button" href="/">
            Go Home
          </Link>
          <SignOut />
        </CardFooter>
      </CardContent>
    </Card>
  );
}
