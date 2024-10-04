import './globals.css';
import {Inter} from 'next/font/google';
import {ThemeProvider} from '@/components/theme-provider';
import {cn} from '@/lib/utils';
import {HeaderBar} from '@/components/HeaderBar';
import {createClient} from '@/lib/supabase/server';

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
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, 'h-full')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HeaderBar session={session} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
