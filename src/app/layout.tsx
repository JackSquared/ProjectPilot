import './globals.css';
import {Inter} from 'next/font/google';
import {createClient} from '@/utils/supabase/server';
import {ThemeProvider} from '@/components/theme-provider';
import {HeaderBar} from '@/components/HeaderBar';
import {cn} from '@/lib/utils';
import CollapsibleChat from '@/components/CollapsibleChat';
import AuthProvider from '@/components/Auth/AuthProvider';

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
  const supabase = createClient();

  const {
    data: {session},
  } = await supabase.auth.getSession();

  const user = session?.user;
  const accessToken = session?.access_token || null;

  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, 'h-full')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider accessToken={accessToken}>
            <div className="flex flex-col h-full">
              <HeaderBar user={user} />
              <div className="flex flex-grow overflow-hidden">
                <main className="flex-grow overflow-auto p-8 scrollbar-hide">
                  {children}
                </main>
                {user && <CollapsibleChat />}
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
        <style>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </body>
    </html>
  );
}

const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`;

<style>{styles}</style>;
