import { Router } from "express";
import { prisma } from "../libs/prisma";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody } from "../middleware/validateBody";
import { createSkillSchema, CreateSkillInput } from "../schemas/skill";

const router = Router();

router.post(
  "/",
  requireAuth,
  validateBody(createSkillSchema),
  async (req, res) => {
    const { category, experience, nature, hourlyRate } =
      req.body as CreateSkillInput;

    const user = req.user;

    if (!user?.profileId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const skill = await prisma.skill.create({
        data: {
          category,
          experience,
          nature,
          hourlyRate,
          profileId: user.profileId,
        },
      });
      res.status(201).json(skill);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/", requireAuth, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const user = req.user;

  if (!user?.profileId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const limit = Math.min(Number(pageSize), 100); // Max page size is 100
  const offset = (Number(page) - 1) * limit;

  try {
    const skills = await prisma.skill.findMany({
      where: {
        profileId: user.profileId,
      },
      skip: offset,
      take: limit,
    });

    res.status(200).json(skills);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
