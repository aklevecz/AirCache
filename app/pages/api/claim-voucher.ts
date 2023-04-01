import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ethers } from "ethers";
import { haversineDistance } from "../../libs/utils";

const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  tx: ethers.Transaction | null | any;
  message: string;
};

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
    // Check if they already have the NFT type
    // const contract = new ethers.Contract(CONTRACT_ADDRESS_FROM_POST_BODY, ABIS[CONTRACT_ADDRESS], provider)
    // const tokenTypes[] = contract.getOwnerEggTypes(user.publicAddress);

    // The reference from cacheId to location or vice versa should be in a db or something
    const { cacheId, groupName, userLocation, cacheLocation, navigator, tokenAddress, tokenType } = req.body;
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

    const nftData = {
      tokenType,
    };

    const wallet = new ethers.Wallet(process.env.PP as string);

    const signature = await wallet._signTypedData(
      {
        name: "teh-raptor",
        version: "1.0",
        chainId: 137,
        verifyingContract: tokenAddress,
      },
      {
        Voucher: [{ name: "tokenType", type: "uint8" }],
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
