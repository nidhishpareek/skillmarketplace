import axios, { AxiosRequestConfig } from "axios";
import { ENV } from "@/constants/env";
import { NextApiRequest } from "next";
import { getCookie } from "cookies-next/server";
import { IncomingMessage } from "http";

/**
 * Sends a request to the server with the provided endpoint and configuration.
 * Automatically includes the API key and backend URL.
 *
 * @param endpoint - The API endpoint to send the request to (relative to the backend URL).
 * @param config - Additional Axios request configuration.
 * @param req - The incoming request object, used to extract the authToken from cookies.
 * @returns The Axios response.
 */
export const sendServerRequest = async (
  endpoint: string,
  config: AxiosRequestConfig,
  req: NextApiRequest | IncomingMessage
) => {
  const apiKey = ENV.API_KEY;
  const backendUrl = ENV.BACKEND_URL;

  if (!apiKey || !backendUrl) {
    throw new Error("API_KEY or BACKEND_URL is not configured");
  }

  const url = `${backendUrl}${endpoint}`;
  const authToken = getCookie("authToken", { req });
  const headers = {
    ...config.headers,
    "api-key": apiKey,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  } as Record<string, string>;

  return axios({
    ...config,
    url,
    headers,
  });
};
