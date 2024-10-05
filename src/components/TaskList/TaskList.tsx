import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { reorderTask } from "./TasksSlice";
import {
  DndContext,
  useSensor,
  useSensors,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SortableTaskItem } from "../SortableTaskItem";

export const TaskList = () => {
  const tasks = useSelector((state: RootState) => state.task);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (tasks.length === 0) {
    return null;
  }

  const handleReorderTask = (fromIndex: number, toIndex: number) => {
    dispatch(reorderTask({ fromIndex, toIndex }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const fromIndex = tasks.findIndex((task) => task.id === active.id);
      const toIndex = tasks.findIndex((task) => task.id === over.id);
      handleReorderTask(fromIndex, toIndex);
    }
  };

  return (
    <div className="w-full">
      <ul className="flex flex-col w-full">
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={tasks.map((task) => task.id)}
          >
            {tasks
              .slice()
              .reverse()
              .map((task) => (
                <SortableTaskItem key={task.id} task={task} />
              ))}
          </SortableContext>
        </DndContext>
      </ul>
    </div>
  );
};
