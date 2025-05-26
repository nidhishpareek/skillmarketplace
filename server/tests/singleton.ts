import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

const prismaMock = mockDeep<PrismaClient>();

// Mock the `findFirst` method with a proper Prisma__ProfileClient return type
prismaMock.profile.findFirst.mockResolvedValue({
  id: "mock-id",
  email: "mock@example.com",
  password: "mockPassword",
  role: "USER",
  type: "INDIVIDUAL",
  firstName: "Mock",
  lastName: "User",
  mobileNumber: "1234567890",
  companyName: null,
  businessTaxNumber: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

jest.mock("../src/libs/prisma", () => ({
  __esModule: true,
  prisma: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export { prismaMock };
