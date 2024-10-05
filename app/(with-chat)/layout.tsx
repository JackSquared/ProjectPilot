import CollapsibleChat from '@/components/CollapsibleChat';
import {createClient} from '@/lib/supabase/server';

export default async function WithChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: {session},
  } = await supabase.auth.getSession();

  const user = session?.user;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-grow overflow-hidden">
        <main className="flex-grow overflow-auto p-8 scrollbar-hide">
          {children}
        </main>
        {user && <CollapsibleChat user={user} />}
      </div>
    </div>
  );
}
