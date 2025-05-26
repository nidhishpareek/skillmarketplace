import React from "react";
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

import { toast } from "react-toastify";
import { useTasks } from "@/hooks/useTasks";
import { useTaskContext } from "@/context/TaskContext";
import { CurrencyOptions, offerSchema } from "@/yupSchema/offerSchema";

const OfferModal = () => {
  const { createOffer } = useTasks();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(offerSchema),
    defaultValues: {
      hourlyRate: undefined,
      startDate: undefined,
      expectedHours: undefined,
      currency: undefined,
    },
  });

  const { selectedTask, offerModalOpen, onOfferClose } = useTaskContext();
  const handleFormSubmit = async (data: any) => {
    try {
      console.log("Submitting offer with data:", data, selectedTask);
      if (!selectedTask?.id) throw new Error("No task selected");

      await createOffer(selectedTask?.id, data); // Use createOffer to submit the offer
      toast.success("Offer submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit offer.");
    }
  };

  return (
    <Modal open={offerModalOpen} onClose={onOfferClose}>
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
          Submit Offer
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="hourlyRate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Hourly Rate"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.hourlyRate}
                helperText={errors.hourlyRate?.message}
              />
            )}
          />
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Start Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
              />
            )}
          />
          <Controller
            name="expectedHours"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Expected Hours"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.expectedHours}
                helperText={errors.expectedHours?.message}
              />
            )}
          />
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Currency"
                fullWidth
                margin="normal"
                error={!!errors.currency}
                helperText={errors.currency?.message}
              >
                {CurrencyOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={onOfferClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default OfferModal;
