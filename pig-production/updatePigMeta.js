const fs = require("fs");
const img_folder = "QmfA8BdwWwQmoR5WjjaKYSooqFcmnFJYSQbAZXB57H3SeG";
for (let i = 1; i <= 100; i++) {
  const path = __dirname + `/pixel_meta2/${i}`;
  const file = fs.readFileSync(path);
  const metadata = JSON.parse(file);
  //   const metadata = require(path);
  metadata.image = `ipfs://${img_folder}/${i}.png`;
  //   fs.unlinkSync(path);
  fs.writeFileSync(path.replace(".json", ""), JSON.stringify(metadata));
}
