import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ethers } from "ethers";
import { haversineDistance } from "../../libs/utils";
import AWS from "aws-sdk";

const ALCHEMY_KEY = process.env.ALCHEMY_KEY_MUMBAI;

const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  tx: ethers.Transaction | null | any;
  message: string;
};

AWS.config.update({
  region: "us-west-2",
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
});
const sqsUrl =
  "https://sqs.us-west-1.amazonaws.com/669844428319/air-yaytso.fifo";
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
var db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | any>
) {
  if (!req.headers.authorization) {
    return res.status(405).json({
      error: "NO_AUTH",
      message: "Import Wallet",
    });
  }
  try {
    const user = (await jwt.verify(
      req.headers.authorization as string,
      JWT_SECRET
    )) as JwtPayload;

    if (!user.publicAddress) {
      res.status(404);
    }

    // More checks
    // Check if their magic link is valid
    // Check if the cache actually has a token

    // The reference from cacheId to location or vice versa should be in a db or something
    const { sacret } = req.body;

    const params = {
      TableName: "air-yaytso-sacrets",
      ExpressionAttributeValues: {
        ":s": sacret,
      },
      KeyConditionExpression: "sacret = :s",
    };
    const dbRes = await db.query(params).promise();
    if (!dbRes.Items) {
      return res.status(405).end();
    }
    const { cacheId } = dbRes.Items[0];
    // return res.status(200).json({ cacheId, address: user.publicAddress });
    const mintParams = {
      MessageAttributes: {
        address: {
          DataType: "String",
          StringValue: user.publicAddress,
        },
        cacheId: {
          DataType: "Number",
          StringValue: cacheId.toString(),
        },
      },
      MessageBody: `Dropping Egg from ${cacheId} to ${user.publicAddress}`,
      MessageDeduplicationId: `${user.publicAddress}-${cacheId}-${
        Math.random() * 100
      }`, // Required for FIFO queues
      MessageGroupId: "yaytso-air-drop", // Required for FIFO queues
      QueueUrl: sqsUrl,
    };
    console.log("SENDING MESSAGE");
    sqs.sendMessage(mintParams, function (err, data) {
      if (err) {
        console.log("Error", err);
        res.status(400).json({ tx: data.MessageId, message: "FAIL" });
      } else {
        console.log("Success", data.MessageId);

        var params = {
          TableName: "air-yaytso-claims",
          Item: {
            email: user.email,
            wallet: user.publicAddress,
            cacheId: cacheId.toString(),
            timestamp: new Date().toISOString(),
          },
        };
        db.put(params).promise();
        res.status(200).json({ tx: data.MessageId, message: "SUCCESS" });
      }
    });

    // const masterWallet = new ethers.Wallet(PP2, defaultProvider);
    // const contract = new ethers.Contract(
    //   AIRCACHE_ADDRESS,
    //   AirCacheInterface.abi,
    //   masterWallet.provider
    // );
    // const signer = contract.connect(masterWallet);
    // // signer.estimateGas
    // //   .dropNFT(cacheId, user.publicAddresss)
    // //   .then((b) => console.log(b.toString()));
    // // console.log("HELLO");
    // // res.status(200).end();
    // // return;
    // const tx = await signer.dropNFT(cacheId, user.publicAddress);
    // console.log(tx);
    // // const receipt = await tx.wait();
    // // for (const event of receipt.events) {
    // //   console.log(event.event);
    // // }

    // res.status(200).json({ tx, message: "SUCCESS" });
  } catch (e) {
    return res.status(405).json({
      error: "NO_AUTH",
      message: "Import Wallet",
    });
  }
}
