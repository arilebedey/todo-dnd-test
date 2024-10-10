import { Droppable, Draggable } from "@hello-pangea/dnd";
import { TasksData } from "../../components/TaskList/TasksSlice";
import { TasksCount } from "../../components/TasksCount";
import { SortableTaskItem } from "../../components/SortableTaskItem";

interface SortableContainerProps {
  items: TasksData;
}

export const SortableContainer = ({ items }: SortableContainerProps) => {
  return (
    <div className="w-full">
      <TasksCount items={items} />
      <Droppable droppableId={items.name}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex w-full min-h-[80px] rounded-lg justify-center items-center ${
              snapshot.isDraggingOver ? "bg-theme-900" : "bg-theme-900"
            }`}
          >
            <ul className="w-full">
              {items.data.length > 0
                ? items.data.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <SortableTaskItem
                          task={task}
                          provided={provided}
                          snapshot={snapshot}
                          categoryId={items.name}
                        />
                      )}
                    </Draggable>
                  ))
                : {
                    ...(items.name === "completed" ? (
                      <div className="flex w-full min-h-[80px] rounded-lg bg-green justify-center items-center my-2"></div>
                    ) : (
                      <div className="flex w-full min-h-[80px] rounded-lg bg-theme justify-center items-center my-2"></div>
                    )),
                  }}
              {provided.placeholder}
            </ul>
          </div>
        )}
      </Droppable>
    </div>
  );
};
