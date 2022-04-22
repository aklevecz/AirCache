import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  user: string | JwtPayload;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!req.headers.authorization) return res.status(405).end();
  try {
    const user = await jwt.verify(
      req.headers.authorization as string,
      JWT_SECRET
    );

    res.status(200).json({ user });
  } catch (e) {
    res.status(405).end();
  }
}
