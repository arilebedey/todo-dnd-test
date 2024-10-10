import type { TaskData } from "../../components/TaskList/TasksSlice";
import { TasksCount } from "../../components/TasksCount";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTaskItem } from "../../components/SortableTaskItem";

interface SortableContainerProps {
  items: TaskData[];
  id: string;
}
export const SortableContainer = ({ items, id }: SortableContainerProps) => {
  // This is needed for empty column to be droppable
  const { setNodeRef } = useDroppable({
    id: id,
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <TasksCount items={items} />
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={items}
        id={id}
      >
        <div
          ref={setNodeRef}
          className="flex w-full min-h-[80px] rounded-lg justify-center items-center"
        >
          <ul className="w-full">
            {items
              .slice()
              .reverse()
              .map((task: TaskData) => (
                <SortableTaskItem key={task.id} task={task} />
              ))}
          </ul>
        </div>
      </SortableContext>
    </div>
  );
};
