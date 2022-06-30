import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "../../libs/db";
import { cacheByGroupTableName, ZERO_ADDRESS } from "../../libs/constants";

const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  dbRes: any;
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
    const { cacheId, tokenId, tokenAddress, groupName } = req.body;
    // const cacheId = 23;
    // const tokenId = 0;
    // const tokenAddress = ZERO_ADDRESS;
    const TableName = cacheByGroupTableName;
    const params = {
      TableName,
      Key: {
        cacheId: cacheId.toString(),
        groupName,
      },
      UpdateExpression: "set tokenAddress = :tokenAddress, tokenId = :tokenId",
      ExpressionAttributeValues: {
        ":tokenAddress": tokenAddress,
        ":tokenId": tokenId,
      },
    };
    const dbRes = await db.update(params).promise();

    res.status(200).json({ dbRes });
  } catch (e) {
    console.log(e);
    res.status(405).end();
  }
}
