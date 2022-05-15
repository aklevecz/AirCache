require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");
console.log(process.env.AWS_S3_ACCESS_KEY);
AWS.config.update({
  region: "us-west-2",
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const pixeltrossesFiles = fs.readdirSync(__dirname + "/images");

const title = (str) => str[0].toUpperCase() + str.slice(1);

pixeltrossesFiles.forEach((file, i) => {
  const coin = file.replace(".png", "");
  const metadata = {
    name: `Pixeltross ${title(coin)}`,
    description: `A Pixeltross hodling some ${title(coin)}`,
    image: `https://cdn.yaytso.art/pixeltross/images/${coin}.png`,
  };
  const filename = `${i + 1}.json`;
  const metafile = Buffer.from(JSON.stringify(metadata));
  var uploadParams = {
    Bucket: "cf-simple-s3-origin-egg2-669844428319",
    Key: `pixeltross/metadata/${filename}`,
    Body: metafile,
    ContentType: "application/json",
  };
  s3.upload(uploadParams, function (err, data) {
    if (!err) {
      fs.writeFileSync(__dirname + `/metadata/${filename}`, metafile);
    }
  });
});

// var fileStream = fs.createReadStream(__dirname + "/images/avax.png");
// fileStream.on("error", function (err) {
//   console.log("File Error", err);
// });
// uploadParams.Body = fileStream;

// s3.upload(uploadParams, function (err, data) {
//   if (err) {
//     console.log("Error", err);
//   }
//   if (data) {
//     console.log("Upload Success", data.Location);
//   }
// });
