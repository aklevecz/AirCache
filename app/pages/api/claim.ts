import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ethers } from "ethers";
import { haversineDistance } from "../../libs/utils";
import AWS from "aws-sdk";
import {
  ALPHABET_CITY,
  ALPHABET_CITY_MUMBAI,
  cacheByGroupTableName,
  ZERO_ADDRESS,
} from "../../libs/constants";
import web3Api from "../../libs/web3Api";
import { update } from "lodash";

const ALCHEMY_KEY = process.env.ALCHEMY_KEY_MUMBAI;
const PP2 = process.env.PP2 as string;
const defaultProvider = new ethers.providers.AlchemyProvider(
  "maticmum",
  ALCHEMY_KEY
);
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
      message: "Sign in",
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
    const {
      cacheId,
      groupName,
      userLocation,
      cacheLocation,
      navigator,
      tokenAddress,
    } = req.body;
    if (tokenAddress === ALPHABET_CITY) {
      const hasWord = await web3Api.accountHasWord(user.publicAddress);
      if (hasWord) {
        return res.json({
          tx: null,
          message:
            "You have already won a word! Let someone else have a chance :)",
          error: "FAIL",
        });
      }
    }

    // return console.log(tokenAddress, "token address", ALPHABET_CITY);
    const distance = haversineDistance(userLocation, cacheLocation);
    const isTooFar = distance > 20;
    console.log(user)
    const isAdmin =
      user.email === "arielklevecz@gmail.com" ||
      user.email === "ariel@yaytso.art" ||
      user.email === "teh@raptor.pizza";
    console.log(user.email, distance);
    if (isTooFar && !isAdmin) {
      return res.json({
        tx: null,
        message: `You are about ${distance} away. You must get closer to claim!`,
        error: "TOO_FAR",
      });
    }

    // Is cache being claimed?
    const TableName = cacheByGroupTableName;

    const queryParams = {
      TableName,
      KeyConditionExpression: "cacheId = :cacheId",
      ExpressionAttributeValues: {
        ":cacheId": cacheId.toString(),
      },
    };

    const queryRes = await db.query(queryParams).promise();
    console.log(queryRes.Items);
    if (!queryRes.Items) {
      return res.json({
        tx: null,
        message: "I don't see this cache anywhere",
        error: "NO_CACHE",
      });
    }
    if (!queryRes.Items[0].tokenId) {
      return res.json({
        tx: null,
        message: "This NFT is already being claimed!",
        error: "CLAIMING",
      });
    }
    // To do: this should also trigger a task to check if the NFT was truly claimed
    // In the future it could even queue people up who were next in line.
    console.log(groupName);
    const updateParams = {
      TableName,
      Key: {
        cacheId: cacheId.toString(),
        groupName,
      },
      UpdateExpression: "set tokenAddress = :tokenAddress, tokenId = :tokenId",
      ExpressionAttributeValues: {
        ":tokenAddress": ZERO_ADDRESS,
        ":tokenId": 0,
      },
    };
    const dbRes = await db.update(updateParams).promise();
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
            phoneNumber:user.phoneNumber,
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
    console.log("no auth");
    return res.status(405).json({
      error: "NO_AUTH",
      message: "Sign in",
    });
  }
}
