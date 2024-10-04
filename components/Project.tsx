'use client';

import {useState} from 'react';
import {Database} from '@/lib/supabase.types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Separator} from '@/components/ui/separator';
import {Github, ExternalLink, Plus, Pencil, Save} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import ProjectIcon from './ProjectIcon';
import {generateProjectIcon} from '@/app/actions/generateProjectIcon';

type Project = Database['public']['Tables']['projects']['Row'];

const techStackItems = [
  {name: 'React', color: 'bg-blue-500'},
  {name: 'Next.js', color: 'bg-black'},
  {name: 'TypeScript', color: 'bg-blue-700'},
  {name: 'Tailwind CSS', color: 'bg-teal-500'},
  {name: 'Prisma', color: 'bg-green-600'},
  {name: 'PostgreSQL', color: 'bg-blue-400'},
];

const kanbanColumns = [
  {
    title: 'To Do',
    cards: [
      'Design user profile page',
      'Implement authentication',
      'Create API endpoints',
    ],
  },
  {
    title: 'In Progress',
    cards: ['Develop dashboard layout', 'Set up CI/CD pipeline'],
  },
  {
    title: 'Done',
    cards: ['Project setup', 'Database schema design', 'Create project README'],
  },
];

export default function project({project: serverProject}: {project: Project}) {
  const [isEditing, setIsEditing] = useState(false);
  const [project, setProject] = useState(serverProject);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSave = async () => {
    const {error} = await supabase.from('projects').upsert(project);
    if (error) {
      console.error(error);
      setError('Failed to save project.');
    } else {
      setIsEditing(false);
      setError(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src="/placeholder.svg?height=64&width=64"
              alt="Project Icon"
            />
            <AvatarFallback>PI</AvatarFallback>
          </Avatar>
          <div>
            {isEditing ? (
              <Input
                value={project.name}
                onChange={(e) => setProject({...project, name: e.target.value})}
                className="text-3xl font-bold text-primary"
              />
            ) : (
              <h1 className="text-3xl font-bold text-primary">
                {project.name}
              </h1>
            )}
            {isEditing ? (
              <Textarea
                value={project.description || ''}
                onChange={(e) =>
                  setProject({...project, description: e.target.value})
                }
                className="text-muted-foreground"
              />
            ) : (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
        </div>
        {isEditing ? (
          <Button variant="ghost" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </Card>

      {error && <div className="text-red-500">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {techStackItems.map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={`${tech.color} text-white`}
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kanban Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {kanbanColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex-shrink-0 w-72">
                <h3 className="font-semibold mb-2">{column.title}</h3>
                <div className="bg-secondary/10 rounded-lg p-2 space-y-2">
                  {column.cards.map((card, cardIndex) => (
                    <Card key={cardIndex}>
                      <CardContent className="p-2">
                        <p className="text-sm">{card}</p>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add a card
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected GitHub Repository</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="GitHub Avatar"
                />
                <AvatarFallback>GH</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">username/project-nexus</p>
                <p className="text-sm text-muted-foreground">
                  Last updated: 2 hours ago
                </p>
              </div>
            </div>
            <Button variant="outline">View Repository</Button>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Latest commit:</span> Update
              README.md with project setup instructions
            </p>
            <p className="text-sm">
              <span className="font-semibold">Branch:</span> main
            </p>
            <p className="text-sm">
              <span className="font-semibold">Open issues:</span> 5
            </p>
            <p className="text-sm">
              <span className="font-semibold">Pull requests:</span> 2
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
