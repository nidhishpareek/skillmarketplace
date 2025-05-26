import React from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { UserRole } from "@/apiCalls/signup";

const TaskDetailsModal = ({ open, onClose, task }: any) => {
  const { user } = useUser();
  const { acceptOffer } = useTasks();

  if (!task) return null;

  const handleAcceptOffer = (offerId: string) => {
    if (task?.id) {
      try {
        acceptOffer(task.id, offerId);
        toast.success("Offer accepted successfully!");
        onClose();
      } catch (error) {
        console.error("Failed to accept offer:", error);
        toast.error("Failed to accept offer. Please try again.");
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Task Details
        </Typography>
        <Typography>Name: {task.name}</Typography>
        <Typography>Category: {task.category}</Typography>
        <Typography>Description: {task.description}</Typography>
        <Typography>
          Posted by: {task.user?.firstName} {task.user?.lastName}
        </Typography>
        <Typography>Company: {task.user?.companyName}</Typography>
        <Typography>Progress Logs:</Typography>
        <List>
          {task.progressLogs.map((log: any, index: number) => (
            <ListItem key={index}>
              <ListItemText primary={log.log.message} />
            </ListItem>
          ))}
        </List>

        {task.offers?.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {user?.role == UserRole.USER ? "Offers" : "Your Offer"}
            </Typography>
            <List>
              {task.offers.map((offer: any) => (
                <ListItem
                  key={offer.id}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <ListItemText
                    primary={`Provider: ${offer.provider.firstName} ${offer.provider.lastName}`}
                    secondary={`Rate: ${offer.hourlyRate} ${offer.currency}, Hours: ${offer.expectedHours}`}
                  />
                  {user?.role === "USER" && !task.acceptedOfferId && (
                    <Button
                      variant="contained"
                      onClick={() => handleAcceptOffer(offer.id)}
                    >
                      Accept
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>
          </>
        )}

        <Button onClick={onClose} variant="outlined" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default TaskDetailsModal;
