const axios = require("axios");

const spotifyURL = "https://api.spotify.com/v1";

//* Download album cover image from Spotify
const search = async (albumName) => {
  try {
    let data = await axios.get(
      `${spotifyURL}/search?query=${encodeURI(
        "bob dylan " + albumName
      )}&type=album,track&offset=0&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_TOKEN}`,
        },
      }
    );
    let image = "";

    if (data.data.albums.total > 0) {
      image = data.data.albums.items[0].images[0];
    } else if (data.data.tracks.total > 0) {
      image = data.data.tracks.items[0].album.images[0];
    }

    return image;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  search,
};
