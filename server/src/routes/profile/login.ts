import { Router } from "express";
import { prisma } from "../../libs/prisma";
import { loginSchema, LoginInput } from "../../schemas/login";
import { validateBody } from "../../middleware/validateBody";
import { createJWT } from "../../utils/auth/jwt";

const router = Router();

router.post("/", validateBody(loginSchema), async (req, res) => {
  const { userIdentity, password } = req.body as LoginInput;
  try {
    const user = await prisma.profile.findFirst({
      where: {
        password,
        OR: [{ email: userIdentity }, { mobileNumber: userIdentity }],
      },
      select: { id: true, role: true, type: true, password: true },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = createJWT({
      id: user.id,
      role: user.role,
      type: user.type ?? "",
    });
    return res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
