import { Request, Response } from "express";
import { prisma } from "../libs/prisma";
import { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
}
/* Context interface with request object */
export interface ContextWithReq extends Context {
  req: Request;
}

/* Context interface with request and response objects */
export interface ContextWithReqRes extends ContextWithReq {
  res: Response;
}

export const context: Context = {
  prisma,
};
