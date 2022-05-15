import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "../../libs/db";

const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  caches: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // if (!req.headers.authorization) return res.status(405).end();
  // try {
  //   const user = await jwt.verify(
  //     req.headers.authorization as string,
  //     JWT_SECRET
  //   );
  const { groupName } = req.query;
  const params = {
    TableName: "cache-by-group",
    ExpressionAttributeValues: {
      ":g": groupName,
    },
    // IndexName: "groupName-index",
    FilterExpression: "groupName = :g",
  };
  const dbRes = await db.scan(params).promise();
  res.status(200).json({ caches: dbRes.Items });
  // } catch (e) {
  //   res.status(405).end();
  // }
}
