import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";

const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  user: string | JwtPayload;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { uri } = req.query;
  console.log(uri);
  const r = await axios.get(uri as string, { responseType: "arraybuffer" });
  res.send(r.data);
}
