const { parse, stringify } = require("svgson");

const sharp = require("sharp");
const fs = require("fs");


const coins = [
  "avax",
  "bitcoin",
  "bnb",
  "ethereum",
  "filecoin",
  "near",
  "polygon",
  "solana",
];
const png_prefix = "data:image/png;base64,";
const hrefAttr = "xlink:href";
const pixel_tross = fs.readFileSync(__dirname + "/pixeltross_template.svg");
(async () => {
  const svgjson = await parse(pixel_tross);
  const img_group = svgjson.children[1];
  coins.forEach((coin) => {
    const coinImg = fs.readFileSync(
      __dirname + "/crypto_icons/" + coin + ".png"
    );
    const dataurl = png_prefix + coinImg.toString("base64");
    img_group.attributes[hrefAttr] = dataurl;
    const svgString = stringify(svgjson);
    const buffer = Buffer.from(svgString);
    sharp(buffer).toFile(__dirname + `/images/${coin}.png`);
  });
})();
