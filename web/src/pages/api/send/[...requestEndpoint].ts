// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
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
  debugger;
  if (!apiKey || !backendUrl) {
    res.status(500).json({ error: "API_KEY or BACKEND_URL is not configured" });
    return;
  }
  const backend = `${backendUrl}${req.url?.replace("/api/send", "")}`;
  const { requestEndpoint, ...query } = req.query;
  console.log("Request URL:", backend, "requestEndpoint:", requestEndpoint);
  try {
    const response = await axios({
      method: req.method,
      url: backend,
      headers: {
        ...req.headers,
        "api-key": apiKey,
      },
      data: req.body,
      params: query,
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "An error occurred" });
  }
}
