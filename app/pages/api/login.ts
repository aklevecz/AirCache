import type { NextApiRequest, NextApiResponse } from "next";
import { Magic } from "@magic-sdk/admin";
import jwt from "jsonwebtoken";

const MAGIC_SECRET = process.env.MAGIC_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST" || !req.headers.authorization)
    return res.status(405).end();

  let magic = new Magic(MAGIC_SECRET);
  const did = magic.utils.parseAuthorizationHeader(req.headers.authorization);
  const user = await magic.users.getMetadataByToken(did);
  var token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
  res.status(200).json({ token });
}
