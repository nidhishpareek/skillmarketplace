import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/auth/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization token missing or invalid" });
  }
  const token = authHeader.replace("Bearer ", "");
  const payload = verifyJWT(token);
  if (
    !payload ||
    typeof payload !== "object" ||
    !("id" in payload && "role" in payload && "type" in payload)
  ) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  // Attach user info to request
  req.user = {
    profileId: payload.id,
    role: payload.role,
    type: payload.type,
  };
  next();
}
