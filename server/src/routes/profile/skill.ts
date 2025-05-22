import { Router, Request, Response } from "express";
import { prisma } from "../../libs/prisma";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../middleware/validateBody";
import { createSkillSchema, CreateSkillInput } from "../../schemas/skill";

const router = Router();

router.post(
  "/",
  requireAuth,
  validateBody(createSkillSchema),
  async (req: Request, res: Response) => {
    const { category, experience, nature, hourlyRate } =
      req.body as CreateSkillInput;

    const user = req.user;

    if (!user?.profileId) {
      return res.status(401).json({ error: "Unauthorized" });
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

module.exports = router;
