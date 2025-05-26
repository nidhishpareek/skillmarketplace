import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    res.setHeader("Set-Cookie", "authToken=; HttpOnly; Path=/; Max-Age=0"); // Clear the cookie
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
