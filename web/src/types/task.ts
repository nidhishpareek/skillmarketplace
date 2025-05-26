import { TaskCategory } from "@/components/TaskModificationModal";

export interface Task {
  id: string;
  category: TaskCategory; // Updated to use TaskCategory enum
  name: string;
  description: string;
}
