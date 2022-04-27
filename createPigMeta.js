const imgFolder = "QmRzzThgu5YDPc1mxk1yTs6a35Rqnyb2SuFkoMsXhw7aiJ";
const fs = require("fs");
const path = require("path");
for (let i = 1; i <= 100; i++) {
  const id = (i % 3) + 1;
  const metadata = {
    name: `Spotted Pig ${id}`,
    description: "It's a spotted pig",
    image: `ipfs://${imgFolder}/${id}.png`,
  };
  fs.writeFileSync(
    path.join(__dirname, `/pigs/metadata/${i}`),
    JSON.stringify(metadata)
  );
}
