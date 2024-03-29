import { NextApiRequest, NextApiResponse } from "next";

type Data = any;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | any>) {
  const { device, loc } = req.query;
  let data: any = { loc: { lat: 1, lng: 2 }, device: { mobile: "dog" } };
  if (device && device !== "{}") {
    data.device = JSON.parse(device as string);
  }
  if (loc && loc !== "{}") {
    data.loc = JSON.parse(loc as string);
  }
  return res.json(data);
}
