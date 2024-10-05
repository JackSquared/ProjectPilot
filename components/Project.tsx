'use client';

import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import {Database} from '@/lib/supabase.types';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Separator} from '@/components/ui/separator';
import {Input} from '@/components/ui/input';
import {Plus, Pencil, Save} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';

type Project = Database['public']['Tables']['projects']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'] & {
  id: number | string;
};

type KanbanColumn = {
  title: string;
  cards: Task[];
};

const techStackItems = [
  {name: 'React', color: 'bg-blue-500'},
  {name: 'Next.js', color: 'bg-black'},
  {name: 'TypeScript', color: 'bg-blue-700'},
  {name: 'Tailwind CSS', color: 'bg-teal-500'},
  {name: 'Prisma', color: 'bg-green-600'},
  {name: 'PostgreSQL', color: 'bg-blue-400'},
];

export default function Project({project: serverProject}: {project: Project}) {
  const [isEditing, setIsEditing] = useState(false);
  const [project, setProject] = useState(serverProject);
  const [error, setError] = useState<string | null>(null);
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchTasks();

    const projectChannel = supabase
      .channel('projects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${project.id}`,
        },
        (payload) => {
          setProject(payload.new as Project);
        },
      )
      .subscribe();

    const tasksChannel = supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${project.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setKanbanColumns((prevColumns) => {
              const newTask = payload.new as Task;
              const columnIndex = ['to do', 'doing', 'done'].indexOf(
                newTask.status,
              );
              const newColumns = [...prevColumns];
              newColumns[columnIndex].cards.push(newTask);
              return newColumns;
            });
          } else if (payload.eventType === 'UPDATE') {
            setKanbanColumns((prevColumns) => {
              const updatedTask = payload.new as Task;
              return prevColumns.map((column) => ({
                ...column,
                cards: column.cards.map((card) =>
                  card.id === updatedTask.id ? updatedTask : card,
                ),
              }));
            });
          } else if (payload.eventType === 'DELETE') {
            setKanbanColumns((prevColumns) => {
              const deletedTaskId = payload.old.id;
              return prevColumns.map((column) => ({
                ...column,
                cards: column.cards.filter((card) => card.id !== deletedTaskId),
              }));
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, []);

  const fetchTasks = async () => {
    const {data: tasks, error} = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', project.id);
    if (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks.');
    } else {
      const columns: KanbanColumn[] = [
        {
          title: 'To Do',
          cards: tasks.filter((task) => task.status === 'to do'),
        },
        {
          title: 'In Progress',
          cards: tasks.filter((task) => task.status === 'doing'),
        },
        {title: 'Done', cards: tasks.filter((task) => task.status === 'done')},
      ];
      setKanbanColumns(columns);
    }
  };

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

  const handleAddCard = async (columnIndex: number) => {
    const status = ['to do', 'doing', 'done'][columnIndex];
    const newTask: Database['public']['Tables']['tasks']['Insert'] = {
      project_id: project.id,
      title: `New Task ${kanbanColumns[columnIndex].cards.length + 1}`,
      status: status,
    };

    const {data, error} = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task.');
    } else if (data) {
      const newColumns = [...kanbanColumns];
      newColumns[columnIndex].cards.push(data);
      setKanbanColumns(newColumns);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const {source, destination} = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColIndex = parseInt(source.droppableId);
    const destColIndex = parseInt(destination.droppableId);
    const sourceCol = kanbanColumns[sourceColIndex];
    const destCol = kanbanColumns[destColIndex];

    const sourceTasks = Array.from(sourceCol.cards);
    const destTasks = Array.from(destCol.cards);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      const newColumns = [...kanbanColumns];
      newColumns[sourceColIndex].cards = sourceTasks;
      setKanbanColumns(newColumns);
    } else {
      destTasks.splice(destination.index, 0, movedTask);
      const newColumns = [...kanbanColumns];
      newColumns[sourceColIndex].cards = sourceTasks;
      newColumns[destColIndex].cards = destTasks;
      setKanbanColumns(newColumns);

      const newStatus = ['to do', 'doing', 'done'][destColIndex];
      const {error} = await supabase
        .from('tasks')
        .update({status: newStatus})
        .eq('id', movedTask.id);

      if (error) {
        console.error('Error updating task status:', error);
        setError('Failed to update task status.');
      }
    }
  };

  return (
    <div className="h-full p-6">
      <div className="space-y-6">
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
                  onChange={(e) =>
                    setProject({...project, name: e.target.value})
                  }
                  className="text-3xl font-bold text-primary"
                />
              ) : (
                <h1 className="text-3xl font-bold text-primary">
                  {project.name}
                </h1>
              )}
              {isEditing ? (
                <Input
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
            <ScrollArea className="w-full h-[400px]">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex space-x-4 pb-4">
                  {kanbanColumns.map((column, columnIndex) => (
                    <div key={columnIndex} className="flex-shrink-0 w-72">
                      <h3 className="font-semibold mb-2">{column.title}</h3>
                      <Droppable droppableId={columnIndex.toString()}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="bg-secondary/10 rounded-lg p-2 space-y-2 min-h-[200px]"
                          >
                            {column.cards.map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <motion.div
                                      initial={{opacity: 0, y: 20}}
                                      animate={{opacity: 1, y: 0}}
                                      exit={{opacity: 0, y: -20}}
                                      transition={{duration: 0.2}}
                                      style={{
                                        transform: snapshot.isDragging
                                          ? 'rotate(3deg)'
                                          : 'rotate(0)',
                                        boxShadow: snapshot.isDragging
                                          ? '0 5px 10px rgba(0,0,0,0.1)'
                                          : 'none',
                                      }}
                                    >
                                      <Card>
                                        <CardContent className="p-2">
                                          <p className="text-sm">
                                            {task.title}
                                          </p>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-muted-foreground"
                              onClick={() => handleAddCard(columnIndex)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add a card
                            </Button>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </DragDropContext>
            </ScrollArea>
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
    </div>
  );
}
