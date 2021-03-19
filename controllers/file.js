const fs = require("fs");
const path = require("path");

const spotifyController = require("./spotify");

//* Read from the discography.txt file
const readDiscography = async () => {
  try {
    let data = fs
      .readFileSync(path.resolve("discography.txt"), {
        encoding: "utf-8",
      })
      .split("\n");

    return await mapData(data);
  } catch (err) {
    console.log(err);
  }
};

//* Map the data from the file to a more convenient array
const mapData = async (data) => {
  let newArray = [];

  for (let index = 0; index < data.length; index++) {
    const element = data[index];

    if (element || element !== "") {
      let stringArr = element.split(" ");
      let year = stringArr[0];
      stringArr.shift();
      let name = stringArr.join(" ");

      let albumCover = await spotifyController.search(name);

      newArray.push({
        year: year,
        decade: Math.floor(year / 10) * 10,
        name: name,
        cover: albumCover,
      });
    }
  }

  return newArray;
};

module.exports = {
  readDiscography,
};
