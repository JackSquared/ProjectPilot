import './globals.css';
import {Inter} from 'next/font/google';
import AuthProvider from '@/components/Auth/AuthProvider';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import Chat from '@/components/Chat';
import {ThemeProvider} from '@/components/theme-provider';
import {HeaderBar} from '@/components/HeaderBar';

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
          <AuthProvider accessToken={accessToken}>
            <div className="px-2 py-8">
              <HeaderBar user={user} />
              <div className="flex flex-col md:flex-row gap-8 mt-8">
                <main className="">{children}</main>

                <aside className="">{user ? <Chat /> : null}</aside>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
