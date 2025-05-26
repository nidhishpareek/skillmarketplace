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
        <Typography>Company: {task.user?.companyName}</Typography>
        <Typography>Progress Logs:</Typography>

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
                <Box key={acceptedOffer.id}>
                  <Typography>
                    <strong>Created At:</strong>{" "}
                    {new Date(acceptedOffer.createdAt).toLocaleString()}
                  </Typography>
                  <Typography>
                    <strong>Currency:</strong> {acceptedOffer.currency}
                  </Typography>
                  <Typography>
                    <strong>Expected Hours:</strong>{" "}
                    {acceptedOffer.expectedHours}
                  </Typography>
                  <Typography>
                    <strong>Hourly Rate:</strong> {acceptedOffer.hourlyRate}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {acceptedOffer.status}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Provider Details
                  </Typography>
                  <Typography>
                    <strong>First Name:</strong>{" "}
                    {acceptedOffer.provider.firstName}
                  </Typography>
                  <Typography>
                    <strong>Last Name:</strong>{" "}
                    {acceptedOffer.provider.lastName}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {acceptedOffer.provider.email}
                  </Typography>
                  <Typography>
                    <strong>Mobile Number:</strong>{" "}
                    {acceptedOffer.provider.mobileNumber}
                  </Typography>
                  <Typography>
                    <strong>Company Name:</strong>{" "}
                    {acceptedOffer.provider.companyName || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Business Tax Number:</strong>{" "}
                    {acceptedOffer.provider.businessTaxNumber || "N/A"}
                  </Typography>
                </Box>
              ))}
          </Box>
        )}

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
      </Box>
    </Modal>
  );
};

export default TaskDetailsModal;
