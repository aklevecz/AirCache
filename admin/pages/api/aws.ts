import aws from "aws-sdk";

aws.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: "us-west-2",
  signatureVersion: "v4",
});

const s3 = new aws.S3();
const db = new aws.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
var cloudfront = new aws.CloudFront({ apiVersion: "2020-05-31" });

export { db, s3, cloudfront };
