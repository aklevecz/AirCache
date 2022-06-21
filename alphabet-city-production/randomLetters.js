const letters = ["P", "I", "Z", "A"];

const getRandomLetter = () => {
  const randomIndex = Math.floor((Math.random() * 1000) % 4);
  return letters[randomIndex];
};

const randomLetters = [];
for (let i = 0; i < 50; i++) {
  randomLetters.push(getRandomLetter());
}

const fs = require("fs");
const path = require("path");
fs.writeFileSync(
  path.join(__dirname, "letters.csv"),
  Buffer.from(randomLetters.join("\n"))
);
