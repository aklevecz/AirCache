import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "../../libs/db";
// const web3 = require("@solana/web3.js");
import * as web3 from "@solana/web3.js";
import * as bip39 from "bip39";
import * as splToken from "@solana/spl-token";
import * as ed25519 from "ed25519-hd-key";
const derivePath = "m/44'/501'/0'/0'";

const { Token } = require("@solana/spl-token");

const JWT_SECRET = process.env.JWT_SECRET as string;

type Data = {
  // caches: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  const mnemonic =
    "warfare dirt coffee swarm advice annual donate photo evil swallow material hub";
  const seed: Buffer = await bip39.mnemonicToSeed(mnemonic);
  // also tried to slice seed.slice(0, 32);
  // const derivedSeed = bip32.fromSeed(seed).derivePath(derivePath).privateKey;
  const derivedSeed = ed25519.derivePath(derivePath, seed.toString("hex")).key;
  const fromWallet = web3.Keypair.fromSeed(derivedSeed);

  const buffer = bip39.mnemonicToSeedSync(mnemonic); // prefer async mnemonicToSeed
  // let seed = new Uint8Array(buffer.toJSON().data.slice(0, 32));

  var toWallet = web3.Keypair.generate();
  const mintPubkey = new web3.PublicKey(
    "6LrQWXjKj9spGDkTfuSdzzyMvWuNP3q7M2kfHPbQaqUg"
  );

  const mint = await splToken.getMint(connection, mintPubkey);
  let fromTokenAddress = await splToken.getAssociatedTokenAddress(
    mintPubkey,
    fromWallet.publicKey
  );
  let toTokenAddress = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mintPubkey,
    toWallet.publicKey
  );
  // console.log(toTokenAddress.toBase58());
  // transfer(
  //   connection,
  //   wallet,
  //   associatedTokenAccount.address,
  //   auxiliaryTokenAccount,
  //   wallet,
  //   50
  // );
  // return;
  let txhash = await splToken.transferChecked(
    connection, // connection
    fromWallet, // payer
    fromTokenAddress, // from (should be a token account)
    mintPubkey, // mint
    toTokenAddress.address, // to (should be a token account)
    fromWallet, // from's owner
    1, // amount, if your deciamls is 8, send 10^8 for 1 token
    0 // decimals
  );
  console.log(txhash);
  // splToken.transfer(
  //   connection,
  //   fromWallet, // from
  //   mintPubkey, // mint
  //   toTokenAddress, // to
  //   fromWallet.publicKey, // from's owner
  //   1 // amount
  // );
}
