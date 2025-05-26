import { Router } from "express";
import { prisma } from "../libs/prisma";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody } from "../middleware/validateBody";
import { createTaskSchema, CreateTaskInput } from "../schemas/task";
import { createOfferSchema, CreateOfferInput } from "../schemas/offer";
import { Role } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/requireAuth";

const router = Router();

router.post(
  "/",
  validateBody(createTaskSchema),
  async (req: AuthenticatedRequest, res) => {
    const { id, category, name, description } = req.body as CreateTaskInput;
    const user = req.user;

    if (!user?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const task = await prisma.task.upsert({
        where: { id: id || "" }, // Use empty string if id is null
        update: {
          category,
          name,
          description,
        },
        create: {
          category,
          name,
          description,
          userId: user.id,
        },
      });
      res.status(201).json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const user = req.user;

  if (!user?.id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const task = await prisma.task.delete({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const providerPropertiesIncluded = {
  provider: {
    select: {
      firstName: true,
      lastName: true,
      email: true,
      mobileNumber: true,
      companyName: true,
      businessTaxNumber: true,
      skills: true,
    },
  },
};

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const user = req.user;
  const isProvider = user?.role === Role.PROVIDER;
  if (!user?.id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const limit = Math.min(Number(pageSize), 100); // Max page size is 100
  const offset = (Number(page) - 1) * limit;

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: user.role === Role.USER ? undefined : user.id },
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        progressLogs: {
          include: {
            log: true,
          },
        },
        acceptedBy: true,
        acceptedOffer: isProvider
          ? {
              include: { ...providerPropertiesIncluded },
            }
          : undefined,
        offers: {
          include: {
            ...providerPropertiesIncluded,
          },
          where: {
            providerId: !isProvider ? user.id : undefined,
          },
        },
      },
    });

    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/:taskId/offer",
  requireAuth,
  validateBody(createOfferSchema),
  async (req: AuthenticatedRequest, res) => {
    const { taskId } = req.params;
    const { hourlyRate, startDate, expectedHours, currency } =
      req.body as CreateOfferInput;
    const user = req.user;
    console.log(user);
    if (!user?.id || user.role !== Role.PROVIDER) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const offer = await prisma.offer.create({
        data: {
          hourlyRate,
          startDate: new Date(startDate),
          expectedHours,
          currency,
          providerId: user.id,
          taskId,
        },
      });

      res.status(201).json(offer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/:taskId/offer/:offerId/accept",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const { taskId, offerId } = req.params;
    const user = req.user;

    if (!user?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      // Check if the task belongs to the user
      const task = await prisma.task.findUnique({
        where: { id: taskId, userId: user.id },
      });

      if (!task) {
        res.status(403).json({
          error:
            "Task not found or you are not authorized to accept this offer",
        });
        return;
      }

      // Accept the offer
      const acceptedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          acceptedOfferId: offerId,
          taskAccepted: true,
        },
      });

      res
        .status(200)
        .json({ message: "Offer accepted successfully", acceptedTask });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
