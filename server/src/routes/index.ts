import { Router } from "express";
import createProfileRouter from "./profile/createProfile";
import loginRouter from "./login";
import skillRouter from "./skill";
import taskRouter from "./task";
import verifyAuth from "./verifyAuth";

const router = Router();

// Health check route
router.get("/", (req, res) => {
  res.send("Server is healthy!");
});

router.use("/profile", createProfileRouter);
router.use("/login", loginRouter);
router.use("/skill", skillRouter);
router.use("/task", taskRouter);
router.use("/verify", verifyAuth);
export default router;
