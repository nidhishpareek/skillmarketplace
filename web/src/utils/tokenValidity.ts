import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { sendServerRequest } from "./serverRequest";
import { GetServerSidePropsContext } from "next";
import { deleteCookie } from "cookies-next/server";

export const decodeToken = async (
  req: NextApiRequest | IncomingMessage,
  authToken?: String
) => {
  try {
    if (!authToken) throw new Error("No auth token found");

    // Verify the token using sendServerRequest
    const verifyData = await sendServerRequest(
      "/verify",
      {
        method: "GET",
        headers: { Authorization: `${authToken}` },
      },
      req
    );

    if (!verifyData.data.valid) throw new Error("Invalid token");

    return { isValid: verifyData.data.valid, user: verifyData.data.user };
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

export const validateTokenAndRedirectLogin = async (
  context: GetServerSidePropsContext
) => {
  const { req, resolvedUrl } = context;
  const authToken = req.cookies?.authToken;

  const validity = await decodeToken(req, authToken);
  if (!validity) {
    deleteCookie("authToken", context); // Clear the invalid token

    const callbackUrl = encodeURIComponent(
      `${resolvedUrl}${
        context.resolvedUrl.includes("?") ? "&" : "?"
      }${new URLSearchParams(
        context.query as Record<string, string>
      ).toString()}`
    );
    return {
      redirect: {
        destination: `/login?callbackUrl=${callbackUrl}`,
        permanent: false,
      },
    };
  }

  return {
    user: validity.user,
  };
};
