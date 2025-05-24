import axios from "axios";

export const handleLogin = async (data: {
  userID: string;
  password: string;
}) => {
  try {
    const response = await axios.post("/api/send/login", data);
    return response.status === 200;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};
