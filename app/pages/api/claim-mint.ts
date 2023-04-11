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
const sqsUrl = "https://sqs.us-west-1.amazonaws.com/669844428319/air-cash.fifo";
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
var db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | any>) {
  const { device, loc } = req.query;
  if (!req.headers.authorization) {
    return res.status(405).json({
      error: "NO_AUTH",
      message: "Sign in",
    });
  }
  try {
    const user = (await jwt.verify(req.headers.authorization as string, JWT_SECRET)) as JwtPayload;
    if (!user.publicAddress) {
      res.status(404);
    }

    // More checks
    // Check if their magic link is valid
    // Check if the cache actually has a token

    // The reference from cacheId to location or vice versa should be in a db or something
    const { cacheId, groupName, userLocation, cacheLocation, navigator, tokenAddress, tokenType } = req.body;

    // return console.log(tokenAddress, "token address", ALPHABET_CITY);
    // transform loc to lat lng
    const middlewareLoc = loc as string;
    const locSplit = middlewareLoc.split(",");
    const deviceLoc = { lat: parseFloat(locSplit[0]), lng: parseFloat(locSplit[1]) };
    const deviceDistance = haversineDistance(userLocation, deviceLoc);
    console.log(deviceDistance);
    const newYorkAreaCodes = [];
    const isSpoofed = deviceDistance > 1000;

    if (isSpoofed) {
      return res.json({
        tx: null,
        message: `Your location looks weird....`,
        error: "TOO_FAR",
      });
    }

    const distance = haversineDistance(userLocation, cacheLocation);
    const isTooFar = distance > 20;
    const isAdmin =
      user.email === "arielklevecz@gmail.com" ||
      // user.email === "ariel@yaytso.art" ||
      // user.email === "teh@raptor.pizza" ||
      user.phoneNumber === "+14159671642";
    if (isTooFar && !isAdmin) {
      return res.json({
        tx: null,
        message: `You are about ${Math.round(distance)}m away. You must get closer to claim!`,
        error: "TOO_FAR",
      });
    }

    // NOT OPTIMIZED - check if they already claimed this egg
    const allClaims = await db.scan({ TableName: "air-yaytso-claims" }).promise();

    const alreadyClaimed = allClaims.Items!.filter((claim) => claim.cacheId === "eggvents").find((claim) => claim.tokenType == tokenType);

    if (alreadyClaimed) {
      return res.status(405).json({
        error: "ALREADY_CLAIMED",
        message: "You already have this one",
      });
    }
    const mintParams = {
      MessageAttributes: {
        address: {
          DataType: "String",
          StringValue: user.publicAddress,
        },
        tokenType: {
          DataType: "String",
          StringValue: tokenType,
        },
      },
      MessageBody: `Sending cash to ${user.publicAddress}`,
      MessageDeduplicationId: `${user.publicAddress}-${Math.random() * 100}`, // Required for FIFO queues
      MessageGroupId: "air-cash", // Required for FIFO queues
      QueueUrl: sqsUrl,
    };

    sqs.sendMessage(mintParams, function (err, data) {
      if (err) {
        console.log("Error", err);
        res.status(400).json({ tx: data.MessageId, message: "FAIL" });
      } else {
        console.log("Success", data.MessageId);
        var params = {
          TableName: "air-yaytso-claims",
          Item: {
            phoneNumber: user.phoneNumber,
            email: user.email,
            wallet: user.publicAddress,
            cacheId: cacheId ? cacheId.toString() : "eggvents",
            timestamp: new Date().toISOString(),
            tokenType,
          },
        };
        db.put(params).promise();
        return res.status(200).json({ tx: data.MessageId, message: "Yay! your egg is being minted as be speak :)", success: true });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(405).json({
      error: "NO_AUTH",
      message: "Sign in",
    });
  }
}
