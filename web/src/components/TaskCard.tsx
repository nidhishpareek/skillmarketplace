import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTaskContext } from "@/context/TaskContext";
import { UserRole } from "@/apiCalls/signup";

const TaskCard = ({ task }: any) => {
  const { user, onViewDetails, onEdit, onOffer } = useTaskContext();

  const hasOffered = task.offers.some(
    (offer: any) => offer.providerId === user.id
  );
  const isAccepted = task.acceptedOffer?.providerId === user.id;
  const isCompleted = task.isCompleted;
  let statusText = hasOffered ? "Offered" : "Offer";
  let color = "primary";
  if (isAccepted) {
    statusText = "In Progress";
    color = "red";
  }
  if (isCompleted) {
    statusText = "Completed";
    color = "success";
  }

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="h6">{task.name}</Typography>
        {user.role === UserRole.USER && (
          <Typography color={color} variant="h6">
            {statusText}
          </Typography>
        )}
      </Box>
      <Typography>Category: &nbsp;{task.category}</Typography>
      <Typography>
        Posted by: &nbsp;{task.user?.firstName} {task.user?.lastName}
      </Typography>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button onClick={() => onViewDetails(task)} variant="outlined">
          View Details
        </Button>
        {user.role === UserRole.USER ? (
          <Button onClick={() => onEdit(task)} variant="contained">
            Edit
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (!hasOffered) onOffer(task);
            }}
            variant={isAccepted ? "outlined" : "contained"}
            disabled={isCompleted || hasOffered}
            sx={{
              backgroundColor: isCompleted ? "lightgreen" : undefined,
              color: isAccepted ? "green" : undefined,
              borderColor: isAccepted ? "green" : undefined,
              "&:hover": {
                backgroundColor: isCompleted ? "green" : undefined,
              },
            }}
          >
            {statusText}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TaskCard;
