export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <div className="w-1/2 overflow-y-auto scrollbar-hide">{children}</div>
    </div>
  );
}
