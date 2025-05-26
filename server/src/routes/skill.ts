import { Request, Router } from "express";
import { prisma } from "../libs/prisma";
import { AuthenticatedRequest, requireAuth } from "../middleware/requireAuth";
import { validateBody } from "../middleware/validateBody";
import { createSkillSchema, CreateSkillInput } from "../schemas/skill";
import { Role } from "@prisma/client";

const router = Router();
router.post(
  "/",
  validateBody(createSkillSchema),
  async (req: AuthenticatedRequest, res) => {
    const { id, category, experience, nature, hourlyRate, currency } =
      req.body as CreateSkillInput;

    const user = req.user;

    if (!user?.profileId || user.role !== Role.USER) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const skill = await prisma.skill.upsert({
        where: { id: id || "" }, // Use empty string if id is null
        update: {
          category,
          experience,
          nature,
          currency,
          hourlyRate,
        },
        create: {
          category,
          experience,
          nature,
          currency,
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

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
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

router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const user = req.user;

  if (!user?.profileId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const deletedSkill = await prisma.skill.deleteMany({
      where: {
        id: id,
        profileId: user.profileId,
      },
    });

    if (deletedSkill.count === 0) {
      res.status(404).json({ error: "Skill not found or unauthorized" });
      return;
    }

    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
