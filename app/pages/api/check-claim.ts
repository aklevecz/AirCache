import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "../../libs/db";

const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  // caches: any;
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
  const { claim } = req.query;
  const params = {
    TableName: "air-yaytso-sacrets",
    ExpressionAttributeValues: {
      ":s": claim,
    },
    KeyConditionExpression: "sacret = :s",
  };
  const dbRes = await db.query(params).promise();
  console.log(dbRes);
  if (dbRes.Items) {
    res.status(200).json({ ...dbRes.Items[0] });
  } else {
    res.status(405).end();
  }
  // } catch (e) {
  //   res.status(405).end();
  // }
}
