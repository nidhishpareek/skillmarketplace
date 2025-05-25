import { Box, Button } from "@mui/material";

export const Header = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        padding: "16px",
        backgroundColor: "#f5f5f5",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Button href="/" variant="text" color="primary">
        Home
      </Button>
      <Button href="/skills" variant="text" color="primary">
        Skills
      </Button>
    </Box>
  );
};
