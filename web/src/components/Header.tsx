import { UserRole } from "@/apiCalls/signup";
import { useUser } from "@/context/UserContext";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export const Header = () => {
  const { user } = useUser();
  const isProvider = user?.role !== UserRole.PROVIDER;

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Logged out successfully!");
        window.location.href = "/login"; // Redirect to login page
      } else {
        toast.error("Failed to log out. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during logout.");
    }
  };

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
      <Button onClick={handleLogout} variant="text" color="secondary">
        Logout
      </Button>
    </Box>
  );
};
