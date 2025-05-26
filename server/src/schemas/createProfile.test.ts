import { createProfileSchema } from "./createProfile";
import { Type, Role } from "@prisma/client";

describe("createProfileSchema", () => {
  it("should validate a valid individual profile", async () => {
    const validIndividualProfile = {
      type: Type.INDIVIDUAL,
      role: Role.USER,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password1!",
      mobileNumber: "0412345678",
      address: {
        streetNumber: "123",
        streetName: "Main St",
        city: "Sydney",
        state: "NSW",
        postcode: "2000",
      },
    };

    await expect(
      createProfileSchema.validate(validIndividualProfile)
    ).resolves.toBeTruthy();
  });

  it("should invalidate an individual profile with missing required fields", async () => {
    const invalidIndividualProfile = {
      type: Type.INDIVIDUAL,
      role: Role.USER,
      email: "john.doe@example.com",
      password: "Password1!",
    };

    await expect(
      createProfileSchema.validate(invalidIndividualProfile)
    ).rejects.toThrow();
  });

  it("should invalidate a company profile with missing required fields", async () => {
    const invalidCompanyProfile = {
      type: Type.COMPANY,
      role: Role.PROVIDER,
      email: "company@example.com",
      password: "Password1!",
    };

    await expect(
      createProfileSchema.validate(invalidCompanyProfile)
    ).rejects.toThrow();
  });

  it("should invalidate a profile with an invalid type", async () => {
    const invalidTypeProfile = {
      type: "INVALID_TYPE",
      role: Role.USER,
      email: "invalid@example.com",
      password: "Password1!",
    };

    await expect(
      createProfileSchema.validate(invalidTypeProfile)
    ).rejects.toThrow();
  });

  it("should invalidate a profile with an invalid postcode", async () => {
    const invalidPostcodeProfile = {
      type: Type.INDIVIDUAL,
      role: Role.USER,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password1!",
      mobileNumber: "0412345678",
      address: {
        streetNumber: "123",
        streetName: "Main St",
        city: "Sydney",
        state: "NSW",
        postcode: "99999",
      },
    };

    await expect(
      createProfileSchema.validate(invalidPostcodeProfile)
    ).rejects.toThrow();
  });
});
