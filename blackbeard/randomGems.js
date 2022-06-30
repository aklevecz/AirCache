const letters = [
  "Emerald",
  "Amethyst",
  "Ruby",
  "Diamond",
  "Gold Ring",
  "Gold Necklace",
];

const getRandomItem = () => {
  const randomNumber = Math.floor(Math.random() * 100);
  let item = "";
  if (randomNumber < 5) {
    item = "Diamond";
  } else if (randomNumber >= 5 && randomNumber < 15) {
    item = "Ruby";
  } else if (randomNumber >= 15 && randomNumber < 30) {
    item = "Emerald";
  } else if (randomNumber >= 30 && randomNumber < 60) {
    item = "Amethyst";
  } else if (randomNumber >= 60 && randomNumber < 80) {
    item = "Gold Ring";
  } else if (randomNumber >= 80 && randomNumber <= 100) {
    item = "Gold Necklace";
  }
  return item;
};

const randomItems = [];
for (let i = 0; i < 33; i++) {
  randomItems.push(getRandomItem());
}

const fs = require("fs");
const path = require("path");
fs.writeFileSync(
  path.join(__dirname, "items.csv"),
  Buffer.from(randomItems.join("\n"))
);
