// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sendServerRequest } from "@/utils/serverRequest";
import { ENV } from "@/constants/env";
import { parseQueryToStrings } from "@/utils/queryParser";
import { setCookie } from "cookies-next/server";

type Data = {
  name: string;
};

type ErrorResponse = {
  error: string;
};
const postCallActions: Record<
  string,
  (
    req: NextApiRequest,
    res: NextApiResponse<Data | ErrorResponse>,
    data: any
  ) => Promise<void>
> = {
  "/login": async (req, res, data) => {
    console.warn("Post call action for /login executed");
    if (data?.token)
      setCookie("authToken", data?.token, {
        req,
        res,
        maxAge: 60 * 60 * 24, // 1 day
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      });
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  const apiKey = ENV.API_KEY;
  const backendUrl = ENV.BACKEND_URL;
  if (!apiKey || !backendUrl) {
    res.status(500).json({ error: "API_KEY or BACKEND_URL is not configured" });
    return;
  }
  const { requestEndpoint, ...query } = req.query;
  const endpoint = `${req.url?.replace("/api/send", "")}` || "";
  console.error("requestEndpoint:", req.url, requestEndpoint);
  try {
    const response = await sendServerRequest(
      endpoint,
      {
        method: req.method,
        headers: req.headers,
        data: req.body,
        params: query,
      },
      req
    );
    if (postCallActions[endpoint]) {
      const action = postCallActions[endpoint];
      await action(req, res, response.data);
    }
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error("Error in API handler:", error);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "An error occurred" });
  }
}
