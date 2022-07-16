import type { NextApiRequest, NextApiResponse } from "next";
import { Magic } from "@magic-sdk/admin";
import jwt from "jsonwebtoken";
import { appKeys } from "../../libs/config";

const MAGIC_SECRET = process.env.MAGIC_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // DYNAMIC MAGIC IF THE POST BODY HAS REFERENCES THE MAGIC APP
  if (req.method !== "POST" || !req.headers.authorization)
    return res.status(405).end();
  const hunt = req.body.destination.replace(/\//g, "");
  let magicSecret = MAGIC_SECRET;
  const keys = appKeys[hunt];
  if (keys) {
    magicSecret = keys.secret;
  }
  let magic = new Magic(magicSecret);
  const did = magic.utils.parseAuthorizationHeader(req.headers.authorization);
  const user = await magic.users.getMetadataByToken(did);
  var token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
  res.status(200).json({ token });
}
