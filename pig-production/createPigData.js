const fs = require("fs");
const args = process.argv.slice(2);

if (args[0] === "metadata") {
  (async () => {
    const files = await fs.readdirSync("./images_100");
    files.forEach((file) => {
      const attrs = file.split(".")[0].split("_");
      const color = attrs[1] ? attrs[1] : "white";
      const dots = attrs[2];
      const numDots = dots.replace("dots", "");
      const id = attrs[3];
      const metadata = {
        name: `Spotted Pig ${id}`,
        description: `This spotted pig has ${numDots} ${color} dots`,
        image: `ipfs://QmRCM7JnwV8dz9DScLJYqV63Rd4GUvVAvozjUd75E4Nt25/${id}.png`,
        attributes: [
          { trait_type: "Dots", value: numDots },
          { trait_type: "Color", value: color },
        ],
      };
      fs.writeFileSync("./metadata/" + id, JSON.stringify(metadata));
    });
  })();
}

if (args[0] === "images") {
  (async () => {
    const base = "./images_100/";
    const files = fs.readdirSync(base);
    files.forEach(async (file) => {
      const data = fs.readFileSync(base + file);
      const id = file.split(".")[0].split("_")[3];
      fs.writeFileSync("./images/" + id + ".png", data);
    });
  })();
}
