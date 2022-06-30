const fs = require("fs");
const _ = require("lodash");
const gemMap = {
  0: "doubloon",
  1: "emerald",
  2: "ruby",
  3: "diamond",
  4: "amethyst",
  5: "gold ring",
  6: "gold necklace",
};

Object.keys(gemMap).forEach((key) => {
  const fileName = key.toString(16).padStart(64, "0");
  const fileNameShort = "0x" + key.toString(16).padStart(2, "0");

  const item = _.startCase(gemMap[key]);
  const metaFile = {
    name: `${item}`,
    description: `This is a beautiful ${item}`,
    image: `https://cdn.yaytso.art/gems/images/${gemMap[key].replace(
      " ",
      "-"
    )}.png`,
  };
  fs.writeFileSync(
    __dirname + "/metadata/" + fileName + ".json",
    JSON.stringify(metaFile)
  );
  fs.writeFileSync(
    __dirname + "/metadata/" + fileNameShort + ".json",
    JSON.stringify(metaFile)
  );
});
