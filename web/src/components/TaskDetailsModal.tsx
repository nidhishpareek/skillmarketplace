import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { UserRole } from "@/apiCalls/signup";

const TaskDetailsModal = ({ open, onClose, task }: any) => {
  const { user } = useUser();
  const { acceptOffer, addProgressLog } = useTasks();
  const [progressLog, setProgressLog] = useState("");

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

  const handleAddProgressLog = async () => {
    if (task?.id && progressLog.trim()) {
      try {
        await addProgressLog(task.id, progressLog);
        toast.success("Progress log added successfully!");
        setProgressLog("");
        onClose();
      } catch (error) {
        console.error("Failed to add progress log:", error);
        toast.error("Failed to add progress log. Please try again.");
      }
    }
  };
  const isProgressPostingAllowed = task.acceptedOffer?.providerId === user?.id;
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

        {task.offers?.length > 0 && (
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="offer-list-content"
              id="offer-list-header"
            >
              <Typography>
                {user?.role == UserRole.USER ? "Offers" : "Your Offer"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
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
            </AccordionDetails>
          </Accordion>
        )}
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
                console.log("Progress Log:", log);
                return (
                  <ListItem key={index}>
                    <ListItemText primary={log.log.description} />
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
        {isProgressPostingAllowed && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              mt: 2,
            }}
          >
            <TextField
              fullWidth
              value={progressLog}
              onChange={(e) => setProgressLog(e.target.value)}
              placeholder="Add progress log"
              variant="outlined"
              sx={{ mr: { md: 2, xs: 0 }, mb: { xs: 2, md: 0 } }}
            />
            <Button
              variant="contained"
              onClick={handleAddProgressLog}
              disabled={!progressLog.trim()}
            >
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default TaskDetailsModal;
