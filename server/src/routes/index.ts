import { Router } from "express";
import createProfileRouter from "./createProfile";
import loginRouter from "./login";
import skillRouter from "./skill";
import taskRouter from "./task";
import verifyAuth from "./verifyAuth";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// Health check route
router.get("/", (req, res) => {
  res.send("Server is healthy!");
});
router.use("/profile", createProfileRouter);
router.use("/login", loginRouter);

router.use("/verify", requireAuth, verifyAuth);
router.use("/skill", requireAuth, skillRouter);
router.use("/tasks", requireAuth, taskRouter);
export default router;
