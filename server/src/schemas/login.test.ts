import { loginSchema } from "./login";
import { ValidationError } from "yup";

describe("loginSchema", () => {
  it("should validate a valid login input", async () => {
    const validInput = {
      userIdentity: "test@example.com",
      password: "Password@123",
    };

    await expect(loginSchema.validate(validInput)).resolves.toEqual(validInput);
  });

  it("should fail if userIdentity is missing", async () => {
    const invalidInput = {
      password: "Password@123",
    };

    await expect(loginSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });

  it("should fail if password is missing", async () => {
    const invalidInput = {
      userIdentity: "test@example.com",
    };

    await expect(loginSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });

  it("should fail if userIdentity is invalid", async () => {
    const invalidInput = {
      userIdentity: "invalid-email",
      password: "Password@123",
    };

    await expect(loginSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });

  it("should fail if password does not meet requirements", async () => {
    const invalidInput = {
      userIdentity: "test@example.com",
      password: "short",
    };

    await expect(loginSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });
});
