// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import sharp from "sharp";
import fs from "fs";
import { cloudfront, db, s3 } from "./aws";
import { getToken } from "next-auth/jwt";

type Data = {
  name: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const airYaytsoBucket = "cf-simple-s3-origin-egg2-669844428319";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log("submitting");
  const token = await getToken({ req });
  if (!token) {
    return res.status(404).end();
  }
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files: any) {
    const host = `https://cdn.yaytso.art`;
    const assetHost = `${host}/${fields.name}`;
    const huntDir = `hunt_configs/${fields.name}`;
    const assetDir = `${fields.name}`;

    const markerEmpty = fs.readFileSync((files.markerEmpty as any).filepath);
    sharp(markerEmpty)
      .resize(50)
      .toBuffer()
      .then((data) => {
        const imgParams = {
          Bucket: airYaytsoBucket,
          Key: `${assetDir}/markerEmpty.png`,
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
          Key: `${assetDir}/markerFilled.png`,
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
      magicLinkType: fields.magicLinkType,
      icons: {
        markerEmpty: `${assetHost}/markerEmpty.png`,
        markerFilled: `${assetHost}/markerFilled.png`,
      },
    };
    const metaParams = {
      Bucket: airYaytsoBucket,
      Key: `${huntDir}/metadata.json`,
      Body: JSON.stringify(metadata),
      ContentType: "application/json",
    };
    await s3.upload(metaParams).promise();

    const email = token.email;

    const putParams = {
      TableName: "air-yaytso-groups",
      Item: {
        name: fields.name,
        creator: email,
      },
    };
    // It could just read from the configs instead of having a a discrete collection for it
    // Though hunts should only be ownable by a particular person -- so maybe the DB is more for permission information?
    db.put(putParams).promise();
    console.log(`${assetDir}/*`, `${huntDir}/*`);
    var params = {
      DistributionId: "E38T2XPXBI32ZY" /* required */,
      InvalidationBatch: {
        /* required */
        CallerReference: ((fields.name as string) + fields.description) as string /* required */,
        Paths: {
          /* required */ Quantity: 2 /* required */,
          Items: [`/${assetDir}/*`, `/${huntDir}/*`],
        },
      },
    };
    cloudfront.createInvalidation(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data); // successful response
    });
  });
  res.status(200).json({ name: "John Doe" });
}
