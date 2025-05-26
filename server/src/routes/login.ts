import { Router } from "express";
import { prisma } from "../libs/prisma";
import { loginSchema, LoginInput } from "../schemas/login";
import { validateBody } from "../middleware/validateBody";
import { createJWT } from "../utils/auth/jwt";

const router = Router();

router.post("/", validateBody(loginSchema), async (req, res) => {
  const { userIdentity, password } = req.body as LoginInput;
  try {
    const user = await prisma.profile.findFirst({
      where: {
        password,
        OR: [{ email: userIdentity }, { mobileNumber: userIdentity }],
      },
      select: {
        id: true,
        role: true,
        type: true,
        password: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" }); // Changed from 400 to 401
      return;
    }
    const token = createJWT({
      id: user.id,
      role: user.role,
      type: user.type,
      name:
        [user.firstName, user.lastName].filter((ele) => ele).join(" ") || "",
    });
    res.json({ token });
    return;
  } catch (error: any) {
    console.error("Login API Error:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

export default router;
