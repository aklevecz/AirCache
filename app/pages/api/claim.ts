import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import AirCacheInterface from "./AirCache.json";
import { ethers } from "ethers";
import { haversineDistance } from "../../libs/utils";
import { AIRCACHE_ADDRESS } from "../../libs/constants";

const ALCHEMY_KEY = process.env.ALCHEMY_KEY_MUMBAI;
const PP2 = process.env.PP2 as string;
const defaultProvider = new ethers.providers.AlchemyProvider(
  "maticmum",
  ALCHEMY_KEY
);
const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  tx: ethers.Transaction | null;
  message: string;
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
    const { cacheId, userLocation, cacheLocation, navigator } = req.body;

    const distance = haversineDistance(userLocation, cacheLocation);
    if (distance > 100) {
      return res.json({ tx: null, message: "TOO_FAR" });
    }
    const masterWallet = new ethers.Wallet(PP2, defaultProvider);
    const contract = new ethers.Contract(
      AIRCACHE_ADDRESS,
      AirCacheInterface.abi,
      masterWallet.provider
    );
    const signer = contract.connect(masterWallet);
    // signer.estimateGas
    //   .dropNFT(cacheId, user.publicAddresss)
    //   .then((b) => console.log(b.toString()));
    // console.log("HELLO");
    // res.status(200).end();
    // return;
    const tx = await signer.dropNFT(cacheId, user.publicAddress);
    console.log(tx);
    // const receipt = await tx.wait();
    // for (const event of receipt.events) {
    //   console.log(event.event);
    // }

    res.status(200).json({ tx, message: "SUCCESS" });
  } catch (e) {
    console.log(e);
    res.status(405).end();
  }
}
