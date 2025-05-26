import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UserRole } from "@/apiCalls/signup";

type Offer = {
  id: string;
  provider: {
    firstName: string;
    lastName: string;
  };
  hourlyRate: number;
  currency: string;
  expectedHours: number;
};

type OffersListingProps = {
  offers: Offer[];
  userRole: UserRole;
  acceptedOfferId: string | null;
  onAcceptOffer: (offerId: string) => void;
};

const OffersListing: React.FC<OffersListingProps> = ({
  offers,
  userRole,
  acceptedOfferId,
  onAcceptOffer,
}) => {
  return (
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="offer-list-content"
        id="offer-list-header"
      >
        <Typography>
          {userRole === UserRole.USER ? "Offers" : "Your Offer"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {offers.map((offer) => (
            <ListItem
              key={offer.id}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText
                primary={`Provider: ${offer.provider.firstName} ${offer.provider.lastName}`}
                secondary={`Rate: ${offer.hourlyRate} ${offer.currency}, Hours: ${offer.expectedHours}`}
              />
              {userRole === UserRole.USER && !acceptedOfferId && (
                <Button
                  variant="contained"
                  onClick={() => onAcceptOffer(offer.id)}
                >
                  Accept
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default OffersListing;
