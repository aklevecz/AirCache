import type { NextApiRequest, NextApiResponse } from "next";
import { Magic } from "@magic-sdk/admin";
import jwt from "jsonwebtoken";

const MAGIC_SECRET = process.env.MAGIC_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET as string;

const appKeys: { [key: string]: { secret: string } } = {
  main: { secret: process.env.MAGIC_SECRET_KEY as string },
  coindeskAustin: { secret: process.env.HORN_MAGIC_SECRET_KEY as string },
};

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
  let magicSecret = MAGIC_SECRET;
  if (req.body.appKey) {
    try {
      magicSecret = appKeys[req.body.appKey as string].secret;
    } catch (e) {
      console.log(e);
      console.log("app key does not exist");
    }
  }
  let magic = new Magic(MAGIC_SECRET);
  const did = magic.utils.parseAuthorizationHeader(req.headers.authorization);
  const user = await magic.users.getMetadataByToken(did);
  var token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
  res.status(200).json({ token });
}
