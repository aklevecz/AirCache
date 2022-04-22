import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import AirCacheInterface from "./AirCache.json";
import { ethers } from "ethers";
import { haversineDistance } from "../../libs/utils";
const AIRCACHE_ADDRESS = "0x83a3d9bE1F032C1f1eC28F9Fa95B7bf2cC3f36B4";
const ALCHEMY_KEY = process.env.ALCHEMY_KEY_MUMBAI;
const PP2 = process.env.PP2 as string;
const defaultProvider = new ethers.providers.AlchemyProvider(
  "maticmum",
  ALCHEMY_KEY
);
const JWT_SECRET = process.env.JWT_SECRET as string;

const masterWallet = new ethers.Wallet(PP2, defaultProvider);
const contract = new ethers.Contract(
  AIRCACHE_ADDRESS,
  AirCacheInterface.abi,
  masterWallet.provider
);

type Data = {
  user: string | JwtPayload;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!req.headers.authorization) return res.status(405).end();
  try {
    const user = (await jwt.verify(
      req.headers.authorization as string,
      JWT_SECRET
    )) as JwtPayload;

    if (!user.publicAddress) {
      res.status(404);
    }

    // More checks
    // Check the lat / lng to the cache on chain
    // Figure out way to avoid faking location

    // The reference from cacheId to location or vice versa should be in a db or something
    console.log(req.body);
    const { cacheId, userLocation, cacheLocation, navigator } = req.body;
    const distance = haversineDistance(userLocation, cacheLocation);
    console.log(navigator);
    console.log(distance);
    return res.status(200).end();
    const signer = contract.connect(masterWallet);
    const tx = await signer.dropNFT(cacheId, user.publicAddress);
    const receipt = await tx.wait();
    for (const event of receipt.events) {
      console.log(event);
    }

    res.status(200).end();
  } catch (e) {
    res.status(405).end();
  }
}
