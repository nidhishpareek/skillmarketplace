import React from "react";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "./TaskCard";

const TaskListing = () => {
  const { tasks } = useTaskContext();

  return (
    <div>
      {tasks.map((task: any) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskListing;
