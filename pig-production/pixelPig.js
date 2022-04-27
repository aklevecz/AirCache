const { parse, stringify } = require("svgson");
const sharp = require("sharp");
const fs = require("fs");

const colorReducer = (n) => {
  if (n < 10) {
    return "#333C83";
  } else if (n >= 10 && n < 50) {
    return "#FFFFFF";
  } else if (n >= 50 && n < 70) {
    return "#EAEA7F";
  } else if (n >= 79 && n < 90) {
    return "#FDAF75";
  } else {
    return "#FDAF75";
  }
};

const pixel_pig_svg = fs.readFileSync(__dirname + "/pixel_pig2.svg");
(async () => {
  const svgjson = await parse(pixel_pig_svg);
  const groups = svgjson.children[0].children;
  for (let i = 1; i <= 100; i++) {
    const spotColor = colorReducer(Math.random() * 100);
    const tailColor = colorReducer(Math.random() * 100);
    const spots = [];
    for (let j = 1; j <= 5; j++) {
      if (Math.random() * 10 > 7) {
        spots.push(j.toString());
      }
    }
    console.log(spots);
    const attributes = { tailColor, spotColor, spots };
    groups.forEach((group) => {
      group.children.forEach((innerGroup) => {
        const id = innerGroup.attributes.id;
        if (id && innerGroup.attributes.id.includes("SPOT")) {
          const spotId = id.split("_")[1];

          innerGroup.children.forEach((spotPixel) => {
            spotPixel.attributes.fill = spotColor;
            spotPixel.attributes.opacity = spots.includes(spotId) ? 1 : 0;
          });
        }

        if (id && innerGroup.attributes.id.includes("TAIL")) {
          innerGroup.children.forEach((tailPixel) => {
            tailPixel.attributes.fill = tailColor;
          });
        }
      });
    });
    const svgString = stringify(svgjson);
    const buffer = Buffer.from(svgString);
    sharp(buffer).toFile(__dirname + `/pixel_images2/${i}.png`);
    const metadata = {
      name: `Spotted Pig ${i}`,
      description: `Spotted Pig #${i} with ${attributes.spots.length} ${attributes.spotColor} spots and a ${attributes.tailColor} tail`,
      image: "",
    };
    fs.writeFileSync(
      __dirname + "/pixel_meta2/" + i + ".json",
      JSON.stringify(metadata)
    );
  }
})();
