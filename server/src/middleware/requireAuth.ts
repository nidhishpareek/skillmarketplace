import { Request as ExpressRequest, Response, NextFunction } from "express";
import { ProfileJWTPayload, verifyJWT } from "../utils/auth/jwt";

export type AuthenticatedRequest = ExpressRequest & {
  user?: ProfileJWTPayload;
};

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization token missing or invalid" });
    return;
  }
  const token = authHeader.replace("Bearer ", "");
  const payload = verifyJWT(token);
  if (
    !payload ||
    typeof payload !== "object" ||
    !("id" in payload && "role" in payload && "type" in payload)
  ) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  // Attach user info to request
  req.user = {
    id: payload.id,
    role: payload.role,
    type: payload.type,
    name: payload.name || "",
  };
  next();
}
