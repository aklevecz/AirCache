// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import sharp from "sharp";
import fs from "fs";
import { db, s3 } from "./aws";

type Data = {
  name: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const airYaytsoBucket = "cf-simple-s3-origin-egg2-669844428319";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files: any) {
    const host = `https://cdn.yaytso.art/hunt_configs/${fields.name}`;
    const huntDir = `hunt_configs/${fields.name}`;

    const markerEmpty = fs.readFileSync((files.markerEmpty as any).filepath);
    sharp(markerEmpty)
      .resize(50)
      .toBuffer()
      .then((data) => {
        const imgParams = {
          Bucket: airYaytsoBucket,
          Key: `${huntDir}/markerEmpty.png`,
          Body: data,
          ContentType: "image/png",
        };
        s3.upload(imgParams, {}, (err, data) => {
          if (err) console.log(err);
        });
      });

    const markerFilled = fs.readFileSync((files.markerFilled as any).filepath);
    sharp(markerFilled)
      .resize(50)
      .toBuffer()
      .then((data) => {
        const imgParams = {
          Bucket: airYaytsoBucket,
          Key: `${huntDir}/markerFilled.png`,
          Body: data,
          ContentType: "image/png",
        };
        s3.upload(imgParams, {}, (err, data) => {
          if (err) console.log(err);
        });
      });

    const metadata = {
      name: fields.name,
      description: fields.description,
      location: fields.location,
      icons: {
        markerEmpty: `${host}/markerEmpty.png`,
        markerFilled: `${host}/markerFilled.png`,
      },
    };
    const metaParams = {
      Bucket: airYaytsoBucket,
      Key: `${huntDir}/metadata.json`,
      Body: JSON.stringify(metadata),
      ContentType: "application/json",
    };
    s3.upload(metaParams, {}, (err, data) => {
      if (err) console.log(err);
    });

    const putParams = {
      TableName: "air-yaytso-groups",
      Item: {
        name: fields.name,
      },
    };
    db.put(putParams).promise();
  });
  res.status(200).json({ name: "John Doe" });
}
