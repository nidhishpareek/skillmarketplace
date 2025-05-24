import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { handleLogin } from "../utils/auth";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const loginSchema = yup.object().shape({
  userID: yup.string().required("UserID is required"),
  password: yup.string().required("Password is required"),
});

const LoginPage = () => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: { userID: string; password: string }) => {
    const success = await handleLogin(data);
    if (success) {
      router.push("/");
    } else {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} width="300px">
          <Controller
            name="userID"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="UserID"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
        <Typography variant="body2" marginTop={2}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" underline="hover">
            Sign up
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export default LoginPage;
