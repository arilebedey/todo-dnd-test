import { DragDropContext } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { reorderTask } from "./TasksSlice";
import { SortableContainer } from "../../widgets/SortableContainer";

export const TaskList = () => {
  const tasks = useSelector((state: RootState) => state.task);
  const notCompletedTasks = tasks[0];
  const completedTasks = tasks[1];

  const dispatch = useDispatch();

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const toCategoryId = destination.droppableId;
    const fromCategoryId = source.droppableId;

    const fromIndex = source.index;
    const toIndex = destination.index;

    if (toIndex === fromIndex && toCategoryId === fromCategoryId) {
      return;
    }

    dispatch(
      reorderTask({
        fromIndex,
        toIndex,
        fromCategoryId,
        toCategoryId,
      }),
    );
  };

  let isTaskListEmpty = false;
  if (tasks[0].data.length === 0 && tasks[1].data.length === 0) {
    isTaskListEmpty = true;
  }

  return (
    <>
      {!isTaskListEmpty ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <SortableContainer items={notCompletedTasks} />
          <SortableContainer items={completedTasks} />
        </DragDropContext>
      ) : (
        <div className="flex items-center w-full pt-14">
          <span className="text-white text-left">
            New tasks will appear here
          </span>
        </div>
      )}
    </>
  );
};
