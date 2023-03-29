const fs = require("fs");

const metadata = require("./metadata.json");
const baseURL = `https://cdn.yaytso.art/magicmap/images`;
const args = process.argv.slice(2);

if (args[0] === "metadata") {
  const colors = ["black", "blue", "red", "yellow"];
  for (let i = 1; i <= 20; i++) {
    const newMetadata = Object.assign({}, metadata);
    const color = colors[i % 3];
    newMetadata.image = `${baseURL}/${color}.png`;
    const metaDataString = JSON.stringify(newMetadata);
    // newMetadata.name = newMetadata.name.replace("{{COLOR}}", color);
    // newMetadata.description = newMetadata.description.replace("{{COLOR}}", color);
    const metadataColored = metaDataString.replace(/{{COLOR}}/g, color.toUpperCase());

    fs.writeFileSync(`./hifihoodie/metadata/${i}.json`, metadataColored);
  }
}
