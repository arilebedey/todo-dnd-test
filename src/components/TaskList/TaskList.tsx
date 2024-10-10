import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { reorderTask, TaskData, toggleTask } from "./TasksSlice";
import type {
  UniqueIdentifier,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  CollisionDetection,
} from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { SortableContainer } from "../../widgets/SortableContainer";
import { useCallback, useMemo, useRef, useState } from "react";
import { SortableTaskItem } from "../SortableTaskItem";

export const TaskList = () => {
  const tasks = useSelector((state: RootState) => state.task);
  const completedTasks = tasks.filter((task: TaskData) => task.completed);
  const notCompletedTasks = tasks.filter((task: TaskData) => !task.completed);
  const sortedTasks = useMemo(
    () => ({
      completed: completedTasks,
      notcompleted: notCompletedTasks,
    }),
    [completedTasks, notCompletedTasks],
  );
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        tolerance: 5,
        delay: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // activeTask - used for displaying DragOverlay
  const [activeTask, setActiveTask] = useState<TaskData | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const findContainer = useCallback(
    (id: UniqueIdentifier) => {
      return (Object.keys(sortedTasks) as Array<keyof typeof sortedTasks>).find(
        (key) => sortedTasks[key].some((task: TaskData) => task.id === id),
      );
    },
    [sortedTasks],
  );

  const itemsBeforeDrag = useRef<null | Record<string, UniqueIdentifier[]>>(
    null,
  );

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const activeTask =
        sortedTasks.completed.find((task) => task.id === active.id) ||
        sortedTasks.notcompleted.find((task) => task.id === active.id);

      if (activeTask) {
        setActiveTask(activeTask); // Ensure the correct active task is being set
      }

      itemsBeforeDrag.current = {
        completed: sortedTasks.completed.map((task) => task.id),
        notcompleted: sortedTasks.notcompleted.map((task) => task.id),
      };
    },
    [sortedTasks],
  );

  const handleDragOver = useCallback(
    ({ over }: DragOverEvent) => {
      if (!over || !activeTask) return;

      const activeId = activeTask.id;
      const overId = over.id;

      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);

      if (!activeContainer || !overContainer) return;

      // Move item between containers
      if (activeContainer !== overContainer) {
        dispatch(toggleTask(activeId));
      }
    },
    [activeTask, findContainer, dispatch],
  );

  const handleDragEnd = useCallback(
    ({ over }: DragEndEvent) => {
      if (!over || !activeTask) {
        setActiveTask(null);
        return;
      }

      const activeId = activeTask.id;
      const overId = over.id;

      if (activeId && overId && activeId !== overId) {
        dispatch(reorderTask({ fromId: activeId, toId: Number(overId) }));
      }

      setActiveTask(null);
    },
    [activeTask, dispatch],
  );

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      const taskItems = [...sortedTasks.completed, ...sortedTasks.notcompleted]; // Flatten task arrays

      if (activeTask && taskItems.some((task) => task.id === activeTask.id)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            taskItems.some((task) => task.id === container.id),
          ),
        });
      }

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);

      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        // Find the task group that matches the overId
        const matchedTaskGroup = taskItems.find((task) => task.id === overId);

        if (matchedTaskGroup) {
          // Return the closest droppable within the group
          const closestDrop = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter((container) =>
              taskItems.some((task) => task.id === container.id),
            ),
          });

          overId = closestDrop[0]?.id;
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeTask?.id ?? null;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeTask, sortedTasks],
  );

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col w-full content-around justify-center gap-6">
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
        >
          <SortableContainer
            id="notcompleted"
            items={sortedTasks.notcompleted}
          />
          <SortableContainer id="completed" items={sortedTasks.completed} />
          <DragOverlay>
            {activeTask ? <SortableTaskItem task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
