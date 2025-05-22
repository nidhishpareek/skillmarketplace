import { PrismaClient } from "@prisma/client";

declare global {
  /* Extend NodeJS namespace to include custom global types */
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Global {}
  }
}
/* Define custom global interface for Prisma clients */
interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
/* Declare global variable with custom interface */
declare const global: CustomNodeJsGlobal;

/* Enable SQL logging if LOG_SQL env variable is true */
const logEnabled = process.env.LOG_SQL === "true";

/* Initialize or reuse Prisma client instance */
const prisma =
  global.prisma ||
  new PrismaClient(logEnabled ? { log: ["query"] } : { log: [] });

/* Cache Prisma client in global scope during development */
if (process.env.NODE_ENV === "development") global.prisma = prisma;

/* Export all Prisma client instances */
export { prisma };
