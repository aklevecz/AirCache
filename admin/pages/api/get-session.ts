import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "../../libs/db";
import { cacheByGroupTableName, ZERO_ADDRESS } from "../../libs/constants";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const token = await getToken({ req });
  console.log(token);
  if (token) {
    // Signed in
    console.log("JSON Web Token", JSON.stringify(token, null, 2));
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
