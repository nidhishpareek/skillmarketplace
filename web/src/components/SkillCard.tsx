import React from "react";
import { Box, Typography, Button } from "@mui/material";

const SkillCard = ({ skill, onEdit }: any) => {
  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <Typography variant="h6">{skill.category}</Typography>
      <Typography>Experience: {skill.experience}</Typography>
      <Typography>Nature: {skill.nature}</Typography>
      <Typography>Hourly Rate: ${skill.hourlyRate}</Typography>
      <Button onClick={() => onEdit(skill)} variant="outlined" sx={{ mt: 2 }}>
        Edit Skill
      </Button>
    </Box>
  );
};

export default SkillCard;
