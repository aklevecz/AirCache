import dotenv from "dotenv";
import fs from "fs";
import { Command } from "commander";
dotenv.config({ path: "./.env.local" });
import db from "../libs/db";
import { cacheByGroupTableName } from "../libs/constants";

// this eventually imports config.ts and borks this
import web3Api from "../libs/web3Api";
import { fetchHuntMeta } from "../libs/api";
import axios from "axios";
const wordHunts = ["nft-nyc", "venice", "la"];

export const isWordHunt = (hunt: string) => wordHunts.includes(hunt);

type Cache = {
  note: string;
  lng: string;
  lat: string;
  cacheId: string;
  groupName: string;
  address: string;
  tokenId?: number;
  tokenAddress?: string;
};

// a function for just updating the metadata instead of everything
// skip the word hunts
const program = new Command();
program.option("--word-hunts").parse();
const options = program.opts();
async function main() {
  const allCachesByGroup = await db.scan({ TableName: cacheByGroupTableName }).promise();

  const caches = allCachesByGroup.Items! as Cache[];

  const cachesByGroupName = caches
    .filter((cache) => cache.groupName === "magicmap")
    .reduce((pv: { [key: string]: Cache[] }, cv) => {
      const caches = pv[cv.groupName] || [];

      pv[cv.groupName] = [...caches, cv];
      return pv;
    }, {});

  const allHuntData: any = {};
  for (const [groupName, caches] of Object.entries(cachesByGroupName)) {
    let huntMeta = null;
    try {
      huntMeta = await fetchHuntMeta(groupName);
      // console.log(huntMeta);
    } catch (e) {}
    const mergedData = [];
    const nftMetadata = [];
    for (const cache of caches) {
      let data: any = cache;
      if (options.wordHunts && cache.tokenId && isWordHunt(cache.groupName)) {
        // for having metadata about the NFT at the map marker level
        // need to import this another way
        const meta = await web3Api.getNFTMeta(cache.tokenId, cache.tokenAddress!);
        var nft = {
          ...meta,
          tokenId: cache.tokenId,
          tokenAddress: cache.tokenAddress,
        };
        nftMetadata.push(nft);

        data.nft = nft;
      }
      if (huntMeta && huntMeta.huntType === "prog") {
        // const dir = huntMeta.groupName
        const dir = "magicmap";
        const uri = `https://cdn.yaytso.art/${dir}/metadata/${cache.tokenId}.json`;
        const meta = (await axios.get(uri)).data;
        var nft = {
          ...meta,
          tokenId: cache.tokenId,
          tokenAddress: huntMeta.contract,
        };
        data.nft = nft;
      }

      mergedData.push(data);
      allHuntData[groupName] = {
        caches: mergedData,
        nftMetadata: nftMetadata || [],
        metadata: huntMeta,
      };
    }
  }
  fs.writeFileSync("./libs/allHuntData.json", JSON.stringify(allHuntData));
}
main();
