import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AIRCACHE_ADDRESS_MATIC } from "../../libs/constants";
import axios, { Method } from "axios";
import { ethers } from "ethers";
import { prod } from "../../libs/env";
import { ALCHEMY_KEY } from "../../libs/web3Api";
import { env } from "process";

const JWT_SECRET = process.env.JWT_SECRET as string;
const AIR_CACHE_FIRST_BLOCK = 27696596;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // if (!req.headers.authorization) return res.status(405).end();
  try {
    //   const user = (await jwt.verify(
    //     req.headers.authorization as string,
    //     JWT_SECRET
    //   )) as JwtPayload;
    const { owner, tokenAddress } = req.query;
    const tokenContractQuery = tokenAddress
      ? "&contractAddresses[]=" + tokenAddress
      : "";
    const network = prod ? "mainnet" : "mumbai";
    const maticurl = `https://polygon-${network}.g.alchemyapi.io/v2/${ALCHEMY_KEY}/getNFTs/`;
    // const mumurl =
    //   "https://polygon-mumbai.g.alchemy.com/v2/" +
    //   process.env.ALCHEMY_KEY_MUMBAI;
    const url = maticurl;
    const config = {
      method: "get" as Method,
      url: `${maticurl}?owner=${owner}${tokenContractQuery}&withMetadata=true`,
    };
    const nftres = await axios.request(config);
    res.status(200).json({ ...nftres.data.ownedNfts });
  } catch (e) {
    console.log(e);
    res.status(405).end();
  }
}
