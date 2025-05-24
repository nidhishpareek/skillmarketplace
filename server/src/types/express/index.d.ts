// types/express/index.d.ts
import "express";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        profileId: string;
        role: string;
        type: string;
      };
    }
  }
}
