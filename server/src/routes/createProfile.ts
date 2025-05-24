import { Router } from "express";
import { prisma } from "../libs/prisma";
import {
  createProfileSchema,
  ProviderProfileInput,
} from "../schemas/providerProfile";
import { validateBody } from "../middleware/validateBody";

const router = Router();

router.post("/", validateBody(createProfileSchema), async (req, res) => {
  const body = req.body as ProviderProfileInput;
  try {
    const profile = await prisma.profile.create({
      data: {
        role: body.role,
        type: body.type,
        password: body.password,
        firstName: body.firstName!,
        lastName: body.lastName!,
        email: body.email!,
        mobileNumber: body.mobileNumber!,
        address: body.address
          ? {
              create: {
                streetNumber: body.address.streetNumber,
                streetName: body.address.streetName,
                city: body.address.city,
                state: body.address.state,
                postcode: body.address.postcode,
              },
            }
          : undefined,
      },
      include: { address: true },
    });

    res.status(201).json(profile);
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
