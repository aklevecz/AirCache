import { NextApiRequest, NextApiResponse } from "next";

type Data = any;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | any>) {
  const loc = res.getHeader("loc");
  const device = res.getHeader("device");
  return res.json({ loc, device });
}
