'use client';

import {useState} from 'react';
import {Button} from './ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

export default function ProjectImageGenerator({
  projectId,
  projectName,
  generateProjectIcon,
}: {
  projectId: number;
  projectName: string;
  generateProjectIcon: (projectId: number) => Promise<string | null>;
}) {
  const [projectIcon, setProjectIcon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    setIsLoading(true);
    try {
      const imageUrl = await generateProjectIcon(projectId);
      setProjectIcon(imageUrl);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <Avatar className="mb-4">
        <AvatarImage src={projectIcon || ''} />
        <AvatarFallback>{projectName.at(0)}</AvatarFallback>
      </Avatar>
      <Button onClick={generateImage} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate project image'}
      </Button>
    </div>
  );
}
