import React from "react";
import { Box, Typography } from "@mui/material";

type Provider = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  companyName?: string;
  businessTaxNumber?: string;
};

type AcceptedOffer = {
  createdAt: string;
  currency: string;
  expectedHours: number;
  hourlyRate: number;
  status: string;
  provider: Provider;
};

type AcceptedOfferDetailsProps = {
  acceptedOffer: AcceptedOffer;
};

const AcceptedOfferDetails: React.FC<AcceptedOfferDetailsProps> = ({
  acceptedOffer,
}) => {
  return (
    <Box>
      <Typography>
        <strong>Created At:</strong>{" "}
        {new Date(acceptedOffer.createdAt).toLocaleString()}
      </Typography>
      <Typography>
        <strong>Currency:</strong> {acceptedOffer.currency}
      </Typography>
      <Typography>
        <strong>Expected Hours:</strong> {acceptedOffer.expectedHours}
      </Typography>
      <Typography>
        <strong>Hourly Rate:</strong> {acceptedOffer.hourlyRate}
      </Typography>
      <Typography>
        <strong>Status:</strong> {acceptedOffer.status}
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Provider Details
      </Typography>
      <Typography>
        <strong>First Name:</strong> {acceptedOffer.provider.firstName}
      </Typography>
      <Typography>
        <strong>Last Name:</strong> {acceptedOffer.provider.lastName}
      </Typography>
      <Typography>
        <strong>Email:</strong> {acceptedOffer.provider.email}
      </Typography>
      <Typography>
        <strong>Mobile Number:</strong> {acceptedOffer.provider.mobileNumber}
      </Typography>
      <Typography>
        <strong>Company Name:</strong>{" "}
        {acceptedOffer.provider.companyName || "N/A"}
      </Typography>
      <Typography>
        <strong>Business Tax Number:</strong>{" "}
        {acceptedOffer.provider.businessTaxNumber || "N/A"}
      </Typography>
    </Box>
  );
};

export default AcceptedOfferDetails;
