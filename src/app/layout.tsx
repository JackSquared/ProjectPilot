import './globals.css';
import { Inter } from 'next/font/google';
import AuthProvider from '@/components/Auth/AuthProvider';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Project Pilot',
  description: 'Empower individuals to create big projects',
};

export default async function RootLayout({ children }: { children: React.ReactNode; }) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col items-center py-2">
          <AuthProvider accessToken={accessToken}>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
