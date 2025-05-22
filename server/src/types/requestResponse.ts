import { Request, Response } from "express";

export interface RequestWithUser extends Request {
  user: {
    profileId: string;
    role: string;
    type: string;
  };
}
