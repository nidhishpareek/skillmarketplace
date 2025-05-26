import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ENV } from "../../config/constants";

export function verifyJWT(token: string): JwtPayload | string | null {
  try {
    if (!ENV.JWT_SECRET) throw new Error("JWT secret is not defined");
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export interface ProfileJWTPayload {
  id: string;
  role: string;
  type: string;
  name: String;
}

export function createJWT(
  profile: ProfileJWTPayload,
  options?: SignOptions
): string {
  if (!ENV.JWT_SECRET) throw new Error("JWT secret is not defined");
  return jwt.sign(profile, ENV.JWT_SECRET, { expiresIn: "7d", ...options });
}
