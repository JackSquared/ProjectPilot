import ProjectChat from '@/components/ProjectChat';

export default function ProjectLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex h-full">
      <div className="w-1/2 overflow-y-auto scrollbar-hide">{children}</div>
      <div className="w-1/2 border-l border-border">
        <ProjectChat />
      </div>
    </div>
  );
}
