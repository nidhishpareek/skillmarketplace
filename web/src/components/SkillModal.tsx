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
import { createSkillSchema, WorkNature, Currency } from "@/apiCalls/skills";

const SkillModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  onDelete,
}: any) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createSkillSchema),
    defaultValues: initialData || {
      category: "",
      experience: "",
      nature: "ONLINE",
      hourlyRate: "",
      id: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
          {initialData ? "Edit Skill" : "Create Skill"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Category"
                fullWidth
                margin="normal"
                error={!!errors.category}
                helperText={errors.category?.message as string | undefined}
              />
            )}
          />
          <Controller
            name="experience"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Experience"
                fullWidth
                margin="normal"
                error={!!errors.experience}
                helperText={errors.experience?.message as string | undefined}
              />
            )}
          />
          <Controller
            name="nature"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Nature"
                fullWidth
                margin="normal"
                error={!!errors.nature}
                helperText={errors.nature?.message as string | undefined}
              >
                {WorkNature.map((nature) => (
                  <MenuItem key={nature} value={nature}>
                    {nature}
                  </MenuItem>
                ))}
              </TextField>
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
                helperText={errors.currency?.message as string | undefined}
              >
                {Currency.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
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
                helperText={errors.hourlyRate?.message as string | undefined}
              />
            )}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            {initialData && (
              <Button
                onClick={() => {
                  if (initialData?.id) {
                    onDelete(initialData.id);
                  }
                }}
                variant="outlined"
                color="error"
              >
                Delete
              </Button>
            )}
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {initialData ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default SkillModal;
