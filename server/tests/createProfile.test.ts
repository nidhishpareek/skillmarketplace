import request from "supertest";
import { app } from "../src/index";
import { prismaMock } from "./singleton";

describe("Create Profile API", () => {
  it("should create a profile with valid individual data", async () => {
    prismaMock.profile.findFirst.mockResolvedValue(null); // No existing profile
    prismaMock.profile.create.mockResolvedValue({
      id: "mock-id",
      role: "USER",
      type: "INDIVIDUAL",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password@123",
      mobileNumber: "1234567890",
      companyName: null,
      businessTaxNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/profile")
      .send({
        type: "INDIVIDUAL",
        role: "USER",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password@123",
        mobileNumber: "1234567890",
        address: {
          streetNumber: "123",
          streetName: "Main St",
          city: "Sydney",
          state: "NSW",
          postcode: "2000",
        },
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", "mock-id");
  });

  it("should return 400 for missing required fields", async () => {
    const response = await request(app).post("/profile").send({
      type: "INDIVIDUAL",
      role: "USER",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });

  it("should return 400 for duplicate email or mobile number", async () => {
    prismaMock.profile.findFirst.mockResolvedValue({
      id: "existing-id",
      role: "USER",
      type: "INDIVIDUAL",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password@123",
      mobileNumber: "1234567890",
      companyName: null,
      businessTaxNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/profile")
      .send({
        type: "INDIVIDUAL",
        role: "USER",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password@123",
        mobileNumber: "1234567890",
        address: {
          streetNumber: "123",
          streetName: "Main St",
          city: "Sydney",
          state: "NSW",
          postcode: "2000",
        },
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "An account with this email or mobile number already exists."
    );
  });
});
