import type { NextApiRequest, NextApiResponse } from "next";
import axios, { Method } from "axios";
import { prod } from "../../libs/env";
import { ALCHEMY_KEY } from "../../libs/web3Api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { owner, tokenAddress } = req.query;
    const tokenContractQuery = tokenAddress
      ? "&contractAddresses[]=" + tokenAddress
      : "";
    const network = prod ? "mainnet" : "mumbai";
    const maticurl = `https://polygon-${network}.g.alchemyapi.io/v2/${ALCHEMY_KEY}/getNFTs/`;
    const queryNFTs = async (pageKey?: string) => {
      const pageKeyQuery = pageKey ? `&pageKey=${pageKey}` : "";
      const config = {
        method: "get" as Method,
        url: `${maticurl}?owner=${owner}${tokenContractQuery}&withMetadata=true${pageKeyQuery}`,
      };
      const nftres = await axios.request(config);
      return nftres.data;
    };
    const nfts = [];
    let pageKey = "";
    while (nfts.length === 0) {
      const data = await queryNFTs(pageKey);
      const filteredOwned = data.ownedNfts.filter((n: any) => n.title);
      pageKey = data.pageKey;
      nfts.push(...filteredOwned);
      if (!pageKey) break;
    }
    res.status(200).json(nfts);
  } catch (e) {
    console.log(e);
    res.status(405).end();
  }
}
