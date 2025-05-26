import { UserRole } from "@/apiCalls/signup";
import { useUser } from "@/context/UserContext";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";

export const Header = () => {
  const { user } = useUser();
  const isProvider = user?.role !== UserRole.PROVIDER;
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
      {!isProvider && (
        <Button href="/skills" variant="text" color="primary">
          Skills
        </Button>
      )}
    </Box>
  );
};
