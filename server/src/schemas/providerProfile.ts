import * as yup from "yup";

export const createProfileSchema = yup.object({
  type: yup.string().oneOf(["INDIVIDUAL", "COMPANY"]).required(),
  role: yup.string().oneOf(["USER", "PROVIDER"]).required(),

  firstName: yup.string().required("First name is required for individuals"),
  lastName: yup.string().required("Last name is required for individuals"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),
  mobileNumber: yup
    .string()
    .matches(/^(\+\d{1,3}[- ]?)?0?\d{10}$/, "Invalid mobile number")
    .required("Mobile number is required for individuals"),
  address: yup
    .object({
      streetNumber: yup.string().required("Street number is required"),
      streetName: yup.string().required("Street name is required"),
      city: yup.string().required("City/Suburb is required"),
      state: yup.string().required("State is required"),
      postcode: yup.string().required("Post code is required"),
    })
    .when("type", {
      is: "INDIVIDUAL", // Only required for individuals
      then: (schema) => schema.required("Address is required for individuals"),
      otherwise: (schema) => schema.optional(),
    }),

  // Company fields
  companyName: yup.string().when("type", {
    is: "COMPANY",
    then: (schema) => schema.required("Company name is required for companies"),
    otherwise: (schema) => schema.optional(),
  }),
  businessTaxNumber: yup.string().when("type", {
    is: "COMPANY",
    then: (schema) =>
      schema
        .matches(
          /^[A-Z0-9]{10}$/,
          "Business Tax Number must be 10 uppercase letters or digits"
        )
        .required("Business Tax Number is required for companies"),
    otherwise: (schema) => schema.optional(),
  }),
});

export type ProviderProfileInput = yup.InferType<typeof createProfileSchema>;
