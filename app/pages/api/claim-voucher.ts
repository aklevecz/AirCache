import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ethers } from "ethers";
import { haversineDistance } from "../../libs/utils";
import AWS from "aws-sdk";
import { ALPHABET_CITY, cacheByGroupTableName, ZERO_ADDRESS } from "../../libs/constants";
import web3Api from "../../libs/web3Api";

const ALCHEMY_KEY = process.env.ALCHEMY_KEY_MUMBAI;
const PP2 = process.env.PP2 as string;
const defaultProvider = new ethers.providers.AlchemyProvider("maticmum", ALCHEMY_KEY);
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
const sqsUrl = "https://sqs.us-west-1.amazonaws.com/669844428319/air-yaytso.fifo";
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
var db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | any>) {
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

    // The reference from cacheId to location or vice versa should be in a db or something
    const { cacheId, groupName, userLocation, cacheLocation, navigator, tokenAddress, tokenType } = req.body;
    console.log(req.body);
    const distance = haversineDistance(userLocation, cacheLocation);
    const isTooFar = distance > 20;
    const isAdmin = false;
    // user.email === "arielklevecz@gmail.com" ||
    // user.email === "ariel@yaytso.art" ||
    // user.email === "teh@raptor.pizza" ||
    // user.phoneNumber === "+14159671642";
    if (isTooFar && !isAdmin) {
      return res.json({
        tx: null,
        message: `You are about ${Math.round(distance)}m away. You must get closer to claim!`,
        error: "TOO_FAR",
      });
    }

    console.log(tokenType, tokenAddress);
    const nftData = {
      tokenType,
    };
    console.log(process.env.PP);
    const wallet = new ethers.Wallet(process.env.PP as string);
    console.log(wallet);
    const signature = await wallet._signTypedData(
      {
        name: "teh-raptor",
        version: "1.0",
        chainId: 137,
        verifyingContract: tokenAddress,
      },
      {
        SignedNFTData: [{ name: "tokenType", type: "uint8" }],
      },
      nftData
    );

    return res.status(200).json({ nftData, signature });
    // Is cache being claimed?
  } catch (e) {
    console.log("no auth");
    return res.status(405).json({
      error: "NO_AUTH",
      message: "Sign in",
    });
  }
}
