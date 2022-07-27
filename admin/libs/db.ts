import AWS from "aws-sdk";

AWS.config.update({
  region: "us-west-2",
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
});
export const sqsUrl =
  "https://sqs.us-west-1.amazonaws.com/669844428319/air-yaytso.fifo";
export var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
var db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

export default db;

const tables = {
  groups: "air-yaytso-groups",
};

export const fetchAllGroups = async () => {
  const params = {
    TableName: tables.groups,
  };
  const response = await db.scan(params).promise();

  if (response.Items) {
    return response.Items;
  } else {
    return [];
  }
};
