import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getCookie } from "cookies-next/server";
import { isValidToken } from "@/utils/tokenValidity";
import { parseQueryToStrings } from "@/utils/queryParser";
import {
  signupSchema,
  handleSignup,
  SignupFormData,
  TYPE_OPTIONS,
  ROLE_OPTIONS,
} from "./api/send/signup";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { control, handleSubmit, watch, trigger } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      type: "INDIVIDUAL",
      role: "USER",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      mobileNumber: "",
      address: {
        streetNumber: "",
        streetName: "",
        city: "",
        state: "",
        postcode: "",
      },
      companyName: "",
      businessTaxNumber: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    const success = await handleSignup(data);
    if (success) {
      toast.success("Signup successful!");
      const callbackUrl = router.query.callbackUrl || "/";
      router.push(callbackUrl as string);
    } else {
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleNext = async () => {
    const isValid = await trigger([
      "type",
      "role",
      "firstName",
      "lastName",
      "email",
      "password",
      "mobileNumber",
    ]);
    if (isValid) setStep(2);
  };

  const handleBack = () => setStep(1);

  const typeValue = watch("type"); // Use watch to observe the type field

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{ backgroundColor: "#f5f5f5", padding: 2 }}
      >
        <Card sx={{ maxWidth: 800, width: "100%", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Signup
            </Typography>
            {step === 1 && (
              <Box component="form">
                <Box sx={{ marginBottom: 2 }}>
                  <Typography variant="h6">Type</Typography>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        {TYPE_OPTIONS.map((type) => (
                          <FormControlLabel
                            key={type}
                            value={type}
                            control={<Radio size="medium" />}
                            label={type}
                          />
                        ))}
                      </RadioGroup>
                    )}
                  />
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <Typography variant="h6">Role</Typography>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        {ROLE_OPTIONS.map((role) => (
                          <FormControlLabel
                            key={role}
                            value={role}
                            control={<Radio />}
                            label={role}
                          />
                        ))}
                      </RadioGroup>
                    )}
                  />
                </Box>

                <Controller
                  name="firstName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Email"
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

                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Mobile Number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Box>
            )}
            {step === 2 && (
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ marginTop: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Address
                  </Typography>
                  <Controller
                    name="address.streetNumber"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Street Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="address.streetName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Street Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="address.city"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="City"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="address.state"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="State"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="address.postcode"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Postcode"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  sx={{ marginBottom: 2 }} // Added margin for spacing
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={handleBack}
                >
                  Back
                </Button>
              </Box>
            )}
            <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
              Already have an account?{" "}
              <a href="/login" style={{ textDecoration: "none" }}>
                Log in here
              </a>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authToken = await getCookie("authToken", context);

  const isTokenValid = await isValidToken(context.req, authToken);

  const query = parseQueryToStrings(context.query);
  if (isTokenValid) {
    // Decode the callback URL from URI encoding
    const callbackUrl = query.callbackUrl
      ? decodeURIComponent(query.callbackUrl)
      : "/";

    return {
      redirect: {
        destination: callbackUrl,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default SignupPage;
