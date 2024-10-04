export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-grow overflow-auto p-8 scrollbar-hide">
        {children}
      </main>
    </div>
  );
}
