import { createSkillSchema } from "./skill";
import { ValidationError } from "yup";

describe("createSkillSchema", () => {
  it("should validate a valid skill input", async () => {
    const validInput = {
      id: null,
      category: "Programming",
      experience: "5 years",
      nature: "ONLINE",
      hourlyRate: 50,
      currency: "USD",
    };

    await expect(createSkillSchema.validate(validInput)).resolves.toEqual(
      validInput
    );
  });

  it("should fail if category is missing", async () => {
    const invalidInput = {
      experience: "5 years",
      nature: "ONLINE",
      hourlyRate: 50,
      currency: "USD",
    };

    await expect(createSkillSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });

  it("should fail if hourlyRate is negative", async () => {
    const invalidInput = {
      id: null,
      category: "Programming",
      experience: "5 years",
      nature: "ONLINE",
      hourlyRate: -10,
      currency: "USD",
    };

    await expect(createSkillSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });

  it("should fail if currency is invalid", async () => {
    const invalidInput = {
      id: null,
      category: "Programming",
      experience: "5 years",
      nature: "ONLINE",
      hourlyRate: 50,
      currency: "INVALID",
    };

    await expect(createSkillSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });

  it("should fail if nature is invalid", async () => {
    const invalidInput = {
      id: null,
      category: "Programming",
      experience: "5 years",
      nature: "INVALID",
      hourlyRate: 50,
      currency: "USD",
    };

    await expect(createSkillSchema.validate(invalidInput)).rejects.toThrow(
      ValidationError
    );
  });
});
