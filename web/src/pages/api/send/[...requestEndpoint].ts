// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sendServerRequest } from "@/utils/serverRequest";
import { ENV } from "@/constants/env";

type Data = {
  name: string;
};

type ErrorResponse = {
  error: string;
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
  const backend = `${backendUrl}${req.url?.replace("/api/send", "")}`;
  const { requestEndpoint, ...query } = req.query;
  console.log("Request URL:", backend, "requestEndpoint:", requestEndpoint);
  try {
    const response = await sendServerRequest(
      req.url?.replace("/api/send", "") || "",
      {
        method: req.method,
        headers: req.headers,
        data: req.body,
        params: query,
      },
      req
    );

    res.status(response.status).json(response.data);
  } catch (error: any) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "An error occurred" });
  }
}
