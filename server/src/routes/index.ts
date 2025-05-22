import { Router } from "express";
import createProfileRouter from "./profile/createProfile";
import loginRouter from "./profile/login";

const router = Router();

// Health check route
router.get("/", (req, res) => {
  res.send("Server is healthy!");
});

router.use("/profile", createProfileRouter);
router.use("/login", loginRouter);

export default router;
