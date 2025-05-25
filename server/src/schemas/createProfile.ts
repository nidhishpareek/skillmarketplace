import { Role, Type } from "@prisma/client";
import { string, object, type InferType } from "yup";

export const createProfileSchema = object({
  type: string().oneOf(Object.values(Type)).required(),
  role: string().oneOf(Object.values(Role)).required(),

  firstName: string().required("First name is required for individuals"),
  lastName: string().required("Last name is required for individuals"),
  email: string().email().required("Email is required"),
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),
  mobileNumber: string()
    .matches(/^(\+\d{1,3}[- ]?)?0?\d{10}$/, "Invalid mobile number")
    .required("Mobile number is required for individuals"),
  address: object({
    streetNumber: string().required("Street number is required"),
    streetName: string().required("Street name is required"),
    city: string().required("City/Suburb is required"),
    state: string().required("State is required"),
    postcode: string()
      .matches(/^[0-9]+$/, "Postcode must be a number")
      .test(
        "is-valid-postcode",
        "Postcode must be between 0200 and 9729",
        (value) => {
          const num = Number(value);
          return num >= 200 && num <= 9729;
        }
      )
      .required("Postcode is required"),
  }).when("type", {
    is: Type.INDIVIDUAL, // Only required for individuals
    then: (schema) => schema.required("Address is required for individuals"),
    otherwise: (schema) => schema.optional(),
  }),

  // Company fields
  companyName: string().when("type", {
    is: Type.COMPANY,
    then: (schema) => schema.required("Company name is required for companies"),
    otherwise: (schema) => schema.optional(),
  }),
  businessTaxNumber: string().when("type", {
    is: Type.COMPANY,
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

export type ProviderProfileInput = InferType<typeof createProfileSchema>;
