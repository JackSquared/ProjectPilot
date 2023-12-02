import './globals.css';
import {Inter} from 'next/font/google';
import AuthProvider from '@/components/Auth/AuthProvider';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import Chat from '@/components/Chat';
import {ThemeProvider} from '@/components/theme-provider';
import {ModeToggle} from '@/components/ModeToggle';

const inter = Inter({subsets: ['latin']});

export const metadata = {
  title: 'Project Pilot',
  description: 'Empower individuals to create big projects',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({cookies: () => cookieStore});

  const {
    data: {session},
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;
  const user = session?.user;

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-row py-2">
            <AuthProvider accessToken={accessToken}>
              <ModeToggle />
              <div className="flex-1 w-2/3">{children}</div>
              <div className="flex-1 w-1/3">{user ? <Chat /> : <></>}</div>
            </AuthProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
