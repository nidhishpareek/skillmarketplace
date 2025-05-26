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

const TaskDetailsModal = ({ open, onClose, task }: any) => {
  if (!task) return null;
  console.log({ task });
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
        <Button onClick={onClose} variant="outlined" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default TaskDetailsModal;
