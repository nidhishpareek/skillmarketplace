import { createOfferSchema } from "./offer";
import { ValidationError } from "yup";

describe("createOfferSchema", () => {
  it("should validate a valid offer input", async () => {
    const validInput = {
      hourlyRate: 100,
      startDate: "2025-06-01",
      expectedHours: 40,
      currency: "USD",
    };

    await expect(createOfferSchema.validate(validInput)).resolves.toEqual(
      validInput
    );
  });

  it("should fail if hourlyRate is missing", async () => {
    const invalidInput = {
      startDate: "2025-06-01",
      expectedHours: 40,
      currency: "USD",
    };

    await expect(createOfferSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });

  it("should fail if startDate is missing", async () => {
    const invalidInput = {
      hourlyRate: 100,
      expectedHours: 40,
      currency: "USD",
    };

    await expect(createOfferSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });

  it("should fail if expectedHours is missing", async () => {
    const invalidInput = {
      hourlyRate: 100,
      startDate: "2025-06-01",
      currency: "USD",
    };

    await expect(createOfferSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });

  it("should fail if currency is invalid", async () => {
    const invalidInput = {
      hourlyRate: 100,
      startDate: "2025-06-01",
      expectedHours: 40,
      currency: "INVALID",
    };

    await expect(createOfferSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });
});
