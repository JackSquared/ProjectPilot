import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import {Plus, ListCollapse} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {motion} from 'framer-motion';
import {api} from '@/app/_trpc/client';
import {useState, useEffect} from 'react';
import {toast} from 'sonner';
import {Database} from '@/lib/supabase.types';
import {createClient} from '@/lib/supabase/client';

type Task = Database['public']['Tables']['tasks']['Row'] & {
  id: number | string;
};

type KanbanColumn = {
  title: string;
  cards: Task[];
};

const KanbanBoard = ({projectId}: {projectId: number}) => {
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([]);
  const {data: tasks} = api.task.getAll.useQuery({projectId: projectId});
  const supabase = createClient();

  const handleAddCard = async (columnIndex: number) => {
    const status = ['to do', 'doing', 'done'][columnIndex];
    const newTask: Database['public']['Tables']['tasks']['Insert'] = {
      project_id: projectId,
      title: `New Task ${kanbanColumns[columnIndex].cards.length + 1}`,
      status: status,
    };

    const {data, error} = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();

    if (error) {
      toast.error('Failed to add task.');
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
        toast.error('Failed to update task status.');
      }
    }
  };

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kanban Board</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full h-[400px] whitespace-nowrap">
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
                                      <div className="flex justify-between items-center">
                                        <p className="text-sm">{task.title}</p>
                                        {task.description && (
                                          <ListCollapse className="w-4 h-4 text-muted-foreground" />
                                        )}
                                      </div>
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default KanbanBoard;
