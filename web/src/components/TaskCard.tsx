import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTaskContext } from "@/context/TaskContext";
import { UserRole, UserType } from "@/apiCalls/signup";

const TaskCard = ({ task }: any) => {
  const { user, onViewDetails, onEdit, onOffer } = useTaskContext();

  const hasOffered = task.offers.some(
    (offer: any) => offer.providerId === user.id
  );

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <Typography variant="h6">{task.name}</Typography>
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
            variant="contained"
            disabled={hasOffered}
          >
            {hasOffered ? "Offered" : "Offer"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TaskCard;
