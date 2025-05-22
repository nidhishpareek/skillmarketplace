import { Router, Request, Response } from "express";
import { prisma } from "../../libs/prisma";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../middleware/validateBody";
import { createTaskSchema, CreateTaskInput } from "../../schemas/task";

const router = Router();

router.post(
  "/",
  requireAuth,
  validateBody(createTaskSchema),
  async (req: Request, res: Response) => {
    const {
      category,
      name,
      description,
      startDate,
      expectedHours,
      hourlyRate,
      currency,
    } = req.body as CreateTaskInput;
    const user = req.user;

    if (!user?.profileId)
      return res.status(401).json({ error: "Unauthorized" });

    try {
      const task = await prisma.task.create({
        data: {
          category,
          name,
          description,
          startDate,
          expectedHours,
          hourlyRate,
          currency,
          userId: user.profileId,
        },
      });
      res.status(201).json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
