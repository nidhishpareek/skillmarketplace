import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { handleLogin, loginSchema } from "../apiCalls/auth";
import { GetServerSideProps } from "next";
import { getCookie } from "cookies-next/server";
import { decodeToken } from "@/utils/tokenValidity";
import { parseQueryToStrings } from "@/utils/queryParser";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const router = useRouter();
  const params = useSearchParams();
  const appendQuery = params ? `?${params}` : "";
  const onSubmit = async (data: InferType<typeof loginSchema>) => {
    const success = await handleLogin({
      userIdentity: data.userIdentity, // Map userIdentity to userID for compatibility
      password: data.password,
    });
    const { callbackUrl } = parseQueryToStrings(router.query);
    if (success) {
      router.push(decodeURIComponent(callbackUrl));
    } else {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
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
            name="userIdentity"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="User Identity"
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
          <Link href={`/signup${appendQuery}`} underline="hover">
            Sign up
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authToken = await getCookie("authToken", context);
  const token = await decodeToken(context.req, authToken);

  if (token) {
    // If the token is valid, redirect to the home page or callback URL
    const callbackUrl = context.query.callbackUrl || "/";
    return {
      redirect: {
        destination: callbackUrl as string,
        permanent: false,
      },
    };
  }
  return { props: {} };
};
