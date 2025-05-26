import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { UserRole } from "@/apiCalls/signup";
import PostProgress from "./PostProgress";
import OffersListing from "./OffersListing";
import AcceptedOfferDetails from "./AcceptedOfferDetails";

const TaskDetailsModal = ({ open, onClose, task }: any) => {
  const { user } = useUser();
  const { acceptOffer, addProgressLog, markTaskComplete } = useTasks();
  const { acknowledgeTask } = useTasks();

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

  const isProvider = task.acceptedOffer?.providerId === user?.id;
  console.log("Task Details:", { isProvider });
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          maxHeight: "90vh", // Limit height to 90% of the viewport
          overflowY: "auto", // Enable vertical scrolling
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Task Details
          </Typography>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
        <Typography>Name: {task.name}</Typography>
        <Typography>Category: {task.category}</Typography>
        <Typography>Description: {task.description}</Typography>
        <Typography>
          Posted by: {task.user?.firstName} {task.user?.lastName}
        </Typography>
        {task.user?.companyName && (
          <Typography>Company: {task.user?.companyName}</Typography>
        )}

        {!isProvider && task.isCompleted && !task.acceptedById && (
          <Box display="flex" gap={2} mt={2}>
            <Button
              onClick={async () => {
                try {
                  await acknowledgeTask(task.id, "accept");
                  toast.success("Task completion accepted");
                } catch {
                  toast.error("Failed to accept task completion");
                }
              }}
              variant="contained"
              sx={{ backgroundColor: "green", color: "white" }}
            >
              Accept
            </Button>
            <Button
              onClick={async () => {
                try {
                  await acknowledgeTask(task.id, "reject");
                  toast.success("Task completion rejected");
                } catch {
                  toast.error("Failed to reject task completion");
                }
              }}
              variant="contained"
              sx={{ backgroundColor: "red", color: "white" }}
            >
              Reject
            </Button>
          </Box>
        )}
        {task.acceptedOfferId && (
          <Box
            sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: "8px" }}
          >
            <Typography variant="h6" gutterBottom>
              Accepted Offer Details
            </Typography>
            {task.offers
              .filter((offer: any) => offer.id === task.acceptedOfferId)
              .map((acceptedOffer: any) => (
                <AcceptedOfferDetails
                  key={acceptedOffer.id}
                  acceptedOffer={acceptedOffer}
                />
              ))}
          </Box>
        )}

        {task.offers?.length > 0 && (
          <OffersListing
            offers={task.offers}
            userRole={user?.role || UserRole.USER}
            acceptedOfferId={task.acceptedOfferId}
            onAcceptOffer={handleAcceptOffer}
          />
        )}
        {!!task.progressLogs.length && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="progress-logs-content"
              id="progress-logs-header"
            >
              <Typography>Progress Logs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {task.progressLogs.map((log: any, index: number) => {
                  return (
                    <ListItem key={index}>
                      <ListItemText primary={log.log.description} />
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        )}
        {!task.isCompleted && (
          <PostProgress
            taskId={task.id}
            isProgressPostingAllowed={isProvider}
            onProgressSubmit={async (taskId, progressLog) => {
              try {
                await addProgressLog(taskId, progressLog);
                toast.success("Progress log added successfully!");
                onClose();
              } catch (error) {
                console.error("Failed to add progress log:", error);
                toast.error("Failed to add progress log. Please try again.");
              }
            }}
          />
        )}
        {isProvider &&
          user?.role === UserRole.PROVIDER &&
          !task.isCompleted && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={async () => {
                try {
                  await markTaskComplete(task.id);
                  toast.success("Task marked as complete");
                  onClose();
                } catch (error) {
                  toast.error("Failed to mark task as complete");
                }
              }}
            >
              Mark Complete
            </Button>
          )}
      </Box>
    </Modal>
  );
};

export default TaskDetailsModal;
