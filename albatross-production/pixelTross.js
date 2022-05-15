const { parse, stringify } = require("svgson");
const { toCSS, toJSON } = require("cssjson");

const sharp = require("sharp");
const fs = require("fs");

const colorReducer = (n) => {
  if (n < 10) {
    return "rgb(255,0,0)";
  } else if (n >= 10 && n < 50) {
    return "rgb(255,255,255)";
  } else if (n >= 50 && n < 70) {
    return "rgb(0,0,0)";
  } else if (n >= 79 && n < 90) {
    return "rgb(255,255,0";
  } else {
    return "rgb(0,0,255)";
  }
};

const cssClassMap = {
  beak: ".cls-1",
  main: ".cls-3",
  mainLightL: ".cls-4",
  feet: ".cls-5",
};

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
  console.log(img_group);
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
  return;
  const groups = svgjson.children[0].children;
  const cssGroup = groups[0].children[0];
  const csson = toJSON(cssGroup.value);
  const css = csson.children;
  for (let i = 0; i < 10; i++) {
    css[cssClassMap["beak"]].attributes.fill = colorReducer(
      Math.random() * 100
    );
    css[cssClassMap["main"]].attributes.fill = colorReducer(
      Math.random() * 100
    );

    console.log(css);
    const cssString = toCSS(csson);
    console.log(cssString);
    cssGroup.value = cssString;
    const svgString = stringify(svgjson);
    const buffer = Buffer.from(svgString);
    sharp(buffer).toFile(__dirname + `/images/${i}.png`);
  }

  // return;
  // for (let i = 1; i <= 100; i++) {
  //   const spotColor = colorReducer(Math.random() * 100);
  //   const tailColor = colorReducer(Math.random() * 100);
  //   const spots = [];
  //   for (let j = 1; j <= 5; j++) {
  //     if (Math.random() * 10 > 7) {
  //       spots.push(j.toString());
  //     }
  //   }
  //   const attributes = { tailColor, spotColor, spots };
  //   groups.forEach((group) => {
  //     group.children.forEach((innerGroup) => {
  //       const id = innerGroup.attributes.id;
  //       if (id && innerGroup.attributes.id.includes("SPOT")) {
  //         const spotId = id.split("_")[1];

  //         innerGroup.children.forEach((spotPixel) => {
  //           spotPixel.attributes.fill = spotColor;
  //           spotPixel.attributes.opacity = spots.includes(spotId) ? 1 : 0;
  //         });
  //       }

  //       if (id && innerGroup.attributes.id.includes("TAIL")) {
  //         innerGroup.children.forEach((tailPixel) => {
  //           tailPixel.attributes.fill = tailColor;
  //         });
  //       }
  //     });
  //   });
  //   const svgString = stringify(svgjson);
  //   const buffer = Buffer.from(svgString);
  //   sharp(buffer).toFile(__dirname + `/pixel_images2/${i}.png`);
  //   const metadata = {
  //     name: `Spotted Pig ${i}`,
  //     description: `Spotted Pig #${i} with ${attributes.spots.length} ${attributes.spotColor} spots and a ${attributes.tailColor} tail`,
  //     image: "",
  //   };
  //   fs.writeFileSync(
  //     __dirname + "/pixel_meta2/" + i + ".json",
  //     JSON.stringify(metadata)
  //   );
  // }
})();
