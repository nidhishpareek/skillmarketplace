import { Router } from "express";
import { AuthenticatedRequest, requireAuth } from "../middleware/requireAuth";

const router = Router();

// Route to verify JWT token
router.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    //auth check is happening in requireAuth middleware, so returning the user object directly
    res.json({ valid: true, user: req.user });
  } catch (error: any) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;
