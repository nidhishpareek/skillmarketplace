import request from "supertest";
import { app } from "../src/index";
import { prismaMock } from "./singleton";

describe("Login API", () => {
  it("should return 200 and a token for valid credentials", async () => {
    prismaMock.profile.findFirst.mockResolvedValue({
      id: "user-id",
      email: "test@example.com",
      password: "Password@123", // Updated to meet schema requirements
      role: "USER",
      type: "INDIVIDUAL",
      firstName: "John",
      lastName: "Doe",
      mobileNumber: "1234567890",
      companyName: null,
      businessTaxNumber: null,
      createdAt: new Date("2025-01-01T00:00:00Z"),
      updatedAt: new Date("2025-01-01T00:00:00Z"),
    });

    const response = await request(app)
      .post("/login")
      .send({ userIdentity: "test@example.com", password: "Password@123" }); // Updated input

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 401 for invalid credentials", async () => {
    prismaMock.profile.findFirst.mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ userIdentity: "wrong@example.com", password: "Wrong@123" }); // Updated input

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid credentials");
  });

  it("should return 400 for missing fields", async () => {
    const response = await request(app).post("/login").send({ email: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors"); // Updated to match response structure
  });
});
