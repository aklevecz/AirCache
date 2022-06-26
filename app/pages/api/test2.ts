import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
const fs = require("fs");
const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  user: string | JwtPayload;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  fs.writeFileSync("./hello.json", "hello");
  res.status(200).end();
}
