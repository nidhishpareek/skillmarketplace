import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { sendServerRequest } from "./serverRequest";
import { GetServerSidePropsContext } from "next";

export const isValidToken = async (
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
        headers: { Authorization: `Bearer ${authToken}` },
      },
      req
    );

    if (!verifyData.data.isValid) throw new Error("Invalid token");

    return verifyData.data.isValid;
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

  try {
    await isValidToken(req, authToken);
  } catch (error) {
    const callbackUrl = encodeURIComponent(resolvedUrl);
    return {
      redirect: {
        destination: `/login?callbackUrl=${callbackUrl}`,
        permanent: false,
      },
    };
  }

  return { props: {} };
};
