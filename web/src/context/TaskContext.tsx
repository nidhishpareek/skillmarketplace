import React, { createContext, useContext, ReactNode, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/context/UserContext";
import { Task } from "@/types/task";

const TaskContext = createContext<{
  tasks: Task[];
  isLoading: boolean;
  error: any;
  updateTask: (taskData: any) => Promise<void>;
  createOffer: (taskId: string, offerData: any) => Promise<void>;
  user: any;
  selectedTask: Task | null;
  detailsModalOpen: boolean;
  modificationModalOpen: boolean;
  offerModalOpen: boolean;
  setDetailsModalOpen: (open: boolean) => void;
  setModificationModalOpen: (open: boolean) => void;
  setOfferModalOpen: (open: boolean) => void;
  onViewDetails: (task: Task) => void;
  onEdit: (task: Task) => void;
  onCreateTask: () => void;
  onOffer: (task: Task) => void;
  onOfferClose: () => void;
} | null>(null);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { tasks, isLoading, error, updateTask, createOffer } = useTasks();
  const { user } = useUser();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modificationModalOpen, setModificationModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const onViewDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailsModalOpen(true);
  };

  const onEdit = (task: Task) => {
    setSelectedTask(task);
    setModificationModalOpen(true);
  };

  const onCreateTask = () => {
    setSelectedTask(null);
    setModificationModalOpen(true);
  };

  const onOffer = (task: Task) => {
    setSelectedTask(task);
    setOfferModalOpen(true);
  };
  const onOfferClose = () => {
    setSelectedTask(null);
    setOfferModalOpen(false);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        updateTask,
        createOffer,
        user,
        selectedTask,
        detailsModalOpen,
        modificationModalOpen,
        offerModalOpen,
        setDetailsModalOpen,
        setModificationModalOpen,
        setOfferModalOpen,
        onViewDetails,
        onEdit,
        onCreateTask,
        onOffer,
        onOfferClose,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
