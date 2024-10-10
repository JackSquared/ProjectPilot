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
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Input} from '@/components/ui/input';
import {Plus, Pencil, Save} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import {api} from '@/app/_trpc/client';

import ConnectedRepository from './ConnectedRepository';
import {useMediaQuery} from 'react-responsive';
import {cn} from '@/lib/utils';
import {Textarea} from './ui/textarea';

type Project = Database['public']['Tables']['projects']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'] & {
  id: number | string;
};

type KanbanColumn = {
  title: string;
  cards: Task[];
};

type ProjectProps = {
  project: Project;
  providerToken: string | null;
};

export default function Project({
  project: serverProject,
  providerToken,
}: ProjectProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [project, setProject] = useState(serverProject);
  const [error, setError] = useState<string | null>(null);
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([]);

  const supabase = createClient();

  const {data: tasks} = api.task.getAll.useQuery({projectId: project.id});
  const isMobile = useMediaQuery({maxWidth: 1240});

  useEffect(() => {
    if (tasks) {
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
  }, [tasks]);

  useEffect(() => {
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

    return () => {
      supabase.removeChannel(projectChannel);
    };
  }, []);

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

  const combinedTags = [
    ...(project.client_tags || []).map((tag) => ({
      name: tag,
      color: 'bg-blue-500',
    })),
    ...(project.server_tags || []).map((tag) => ({
      name: tag,
      color: 'bg-teal-500',
    })),
    ...(project.ops_tags || []).map((tag) => ({
      name: tag,
      color: 'bg-green-600',
    })),
  ];

  return (
    <div
      className={cn(
        'overflow-y-auto scrollbar-hide',
        isMobile ? 'w-full' : 'w-1/2',
      )}
    >
      <div className="h-full p-6">
        <div className="space-y-6">
          <Card>
            <div className="p-4 relative">
              <div className="absolute top-4 right-4">
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
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={project.name}
                    onChange={(e) =>
                      setProject({...project, name: e.target.value})
                    }
                    className="text-3xl font-bold text-primary mb-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-primary mb-2">
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
          </Card>

          {error && <div className="text-red-500">{error}</div>}

          <Card>
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {combinedTags.map((tech, index) => (
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
          <ConnectedRepository
            projectId={project.id}
            providerToken={providerToken}
            onSelect={() => {}}
          />
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
        </div>
      </div>
    </div>
  );
}
