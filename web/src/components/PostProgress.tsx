import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

type PostProgressProps = {
  taskId: string;
  isProgressPostingAllowed: boolean;
  onProgressSubmit: (taskId: string, progressLog: string) => Promise<void>;
};

const PostProgress: React.FC<PostProgressProps> = ({
  taskId,
  isProgressPostingAllowed,
  onProgressSubmit,
}) => {
  const [progressLog, setProgressLog] = useState("");

  const handleAddProgressLog = async () => {
    if (taskId && progressLog.trim()) {
      await onProgressSubmit(taskId, progressLog);
      setProgressLog("");
    }
  };

  if (!isProgressPostingAllowed) return null;

  return (
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
  );
};

export default PostProgress;
