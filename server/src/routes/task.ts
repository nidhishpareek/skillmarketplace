import { Router } from "express";
import { prisma } from "../libs/prisma";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody } from "../middleware/validateBody";
import { createTaskSchema, CreateTaskInput } from "../schemas/task";
import { createOfferSchema, CreateOfferInput } from "../schemas/offer";
import { createProgressLogSchema } from "../schemas/progressLog";
import { Role } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/requireAuth";
import { acknowledgeTaskSchema } from "../schemas/acknowledgeTask";

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

  const providerPropertiesIncluded = {
    include: {
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
    },
    where: {
      providerId: !isProvider ? undefined : user.id,
    },
  };
  const where = isProvider // for provider, show tasks with accepted offers or no offers
    ? {
        OR: [
          { acceptedOffer: { providerId: user.id } },
          { acceptedOfferId: null },
        ],
      }
    : { userId: user.id }; // for user, show tasks created by the user
  try {
    const tasks = await prisma.task.findMany({
      where,
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
        acceptedOffer: isProvider ? providerPropertiesIncluded : undefined,
        offers: providerPropertiesIncluded,
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

router.post(
  "/:id/progressLog",
  requireAuth,
  validateBody(createProgressLogSchema),
  async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { description } = req.body;
    const user = req.user;

    if (!user?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Check if the task is accepted and the provider matches the user
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        acceptedOffer: {
          select: {
            providerId: true,
          },
        },
      },
    });

    if (!task || task.acceptedOffer?.providerId !== user.id) {
      res.status(403).json({
        error: "You are not authorized to create a progress log for this task.",
      });
      return;
    }

    try {
      const progressLog = await prisma.$transaction(async (prisma) => {
        const log = await prisma.logs.create({
          data: {
            description,
            profileId: user.id,
          },
        });

        const progressLog = await prisma.progressLogs.create({
          data: {
            taskId: id,
            profileId: user.id,
            logId: log.id,
          },
          include: {
            log: true,
          },
        });

        return progressLog;
      });

      res.status(201).json({ log: progressLog.log, progressLog });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/:id/complete",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const user = req.user;

    if (!user?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Check if the task is accepted and the provider matches the user
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        acceptedOffer: {
          select: {
            providerId: true,
          },
        },
      },
    });

    if (!task || task.acceptedOffer?.providerId !== user.id) {
      res.status(403).json({
        error: "You are not authorized to create a progress log for this task.",
      });
      return;
    }
    try {
      const updatedTask = await prisma.$transaction(async (prisma) => {
        const taskUpdate = await prisma.task.update({
          where: { id },
          data: { isCompleted: true, completedAt: new Date() },
        });

        const progressLog = await prisma.logs.create({
          data: {
            description: `${
              user.name
            } marked the task completed at ${new Date().toDateString()}`,
            profileId: user.id,
          },
        });

        await prisma.progressLogs.create({
          data: {
            taskId: id,
            profileId: user.id,
            logId: progressLog.id,
          },
        });

        return taskUpdate;
      });

      res
        .status(200)
        .json({ message: "Task marked as complete", task: updatedTask });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/:id/acknowledge",
  requireAuth,
  validateBody(acknowledgeTaskSchema),
  async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { action } = req.body; // action can be 'accept' or 'reject'
    const user = req.user;

    if (!user?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      if (action === "accept") {
        const updatedTask = await prisma.task.update({
          where: { id },
          data: {
            acceptedAt: new Date(),
            acceptedById: user.id,
          },
        });

        res
          .status(200)
          .json({ message: "Task completion accepted", task: updatedTask });
      } else if (action === "reject") {
        const updatedTask = await prisma.$transaction(async (prisma) => {
          const taskUpdate = await prisma.task.update({
            where: { id },
            data: {
              completedAt: null,
              isCompleted: false,
            },
          });

          const progressLog = await prisma.logs.create({
            data: {
              description: `${
                user.name
              } rejected the task completion at ${new Date().toISOString()}`,
              profileId: user.id,
            },
          });

          await prisma.progressLogs.create({
            data: {
              taskId: id,
              profileId: user.id,
              logId: progressLog.id,
            },
          });

          return taskUpdate;
        });

        res
          .status(200)
          .json({ message: "Task completion rejected", task: updatedTask });
      } else {
        res
          .status(400)
          .json({ error: "Invalid action. Use 'accept' or 'reject'." });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
