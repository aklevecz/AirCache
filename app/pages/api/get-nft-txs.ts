import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AIRCACHE_ADDRESS_MATIC } from "../../libs/constants";
import axios from "axios";
import { ethers } from "ethers";

const JWT_SECRET = process.env.JWT_SECRET as string;
const AIR_CACHE_FIRST_BLOCK = 27696596;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (!req.headers.authorization) return res.status(405).end();
  try {
    const user = (await jwt.verify(
      req.headers.authorization as string,
      JWT_SECRET
    )) as JwtPayload;
    const url = `https://polygon-mainnet.g.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`;
    var data = JSON.stringify({
      jsonrpc: "2.0",
      id: 0,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: ethers.utils.hexlify(AIR_CACHE_FIRST_BLOCK),
          // toBlock: "0xA97CAC",
          toAddress: user.publicAddress,
          // contractAddresses: ["0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"],
          // maxCount: "0x5",
          excludeZeroValue: true,
          category: ["erc721", "erc1155"],
        },
      ],
    });
    const nftres = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    res.status(200).json({ ...nftres.data });
  } catch (e) {
    console.log(e);
    res.status(405).end();
  }
}
