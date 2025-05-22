import { Router } from "express";
import createProfileRouter from "./profile/createProfile";
import loginRouter from "./profile/login";
const skillRouter = require("./profile/skill");
const taskRouter = require("./profile/task");

const router = Router();

// Health check route
router.get("/", (req, res) => {
  res.send("Server is healthy!");
});

router.use("/profile", createProfileRouter);
router.use("/login", loginRouter);
router.use("/skill", skillRouter);
router.use("/task", taskRouter);

export default router;
