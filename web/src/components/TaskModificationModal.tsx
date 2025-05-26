import React, { useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useTaskContext } from "@/context/TaskContext";
import { Task } from "@/types/task";

export enum TaskCategory {
  DEVELOPMENT = "DEVELOPMENT",
  DESIGN = "DESIGN",
  MARKETING = "MARKETING",
}
export const TaskCategoryOptions = Object.values(TaskCategory);

const taskSchema = yup.object().shape({
  category: yup
    .mixed<TaskCategory>()
    .oneOf(TaskCategoryOptions, "Invalid category")
    .required("Category is required"),
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
});

const defaultTaskValues = {
  category: TaskCategory.DEVELOPMENT, // Default to a valid TaskCategory
  name: "",
  description: "",
};

const TaskModificationModal = () => {
  const {
    modificationModalOpen,
    setModificationModalOpen,
    selectedTask,
    updateTask,
  } = useTaskContext();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: selectedTask || defaultTaskValues, // Use defaultTaskValues for compatibility
  });

  useEffect(() => {
    if (selectedTask) {
      reset(selectedTask);
    }
  }, [selectedTask, reset]);

  const handleFormSubmit = async (data: any) => {
    try {
      await updateTask(data);
      toast.success("Task saved successfully!");
      setModificationModalOpen(false);
    } catch (error) {
      toast.error("Failed to save task.");
    }
  };
  return (
    <Modal
      open={modificationModalOpen}
      onClose={() => setModificationModalOpen(false)}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {selectedTask ? "Edit Task" : "Create Task"}
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Category"
                fullWidth
                margin="normal"
                error={!!errors.category}
                helperText={errors.category?.message as string | undefined}
              >
                {TaskCategoryOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message as string | undefined}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={4} // Adjust the number of rows as needed
                error={!!errors.description}
                helperText={errors.description?.message as string | undefined}
              />
            )}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              onClick={() => setModificationModalOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {selectedTask ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default TaskModificationModal;
