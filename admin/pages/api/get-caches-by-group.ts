import type { NextApiRequest, NextApiResponse } from "next";
import { cacheByGroupTableName } from "../../libs/constants";
import db from "../../libs/db";

type Data = {
  caches: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { groupName } = req.query;
  console.log(groupName);
  console.log(cacheByGroupTableName);
  const params = {
    TableName: cacheByGroupTableName,
    ExpressionAttributeValues: {
      ":g": groupName,
    },
    FilterExpression: "groupName = :g",
  };
  const dbRes = await db.scan(params).promise();
  console.log(dbRes.Items);
  res.status(200).json({ caches: dbRes.Items });
}
