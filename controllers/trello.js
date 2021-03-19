const axios = require("axios");

const fileController = require("./file");

//* Board creation
const createBoard = async () => {
  try {
    let response = await axios.post(
      `https://api.trello.com/1/boards/?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}&name=Bob+Dylan+Discography&defaultLists=false`
    );

    return {
      message: "Board created",
      boardId: response.data.id,
      response,
    };
  } catch (err) {
    console.error({ message: "An error occurred creating the board.", err });
  }
};

//* List creation sorted by decades
const createList = async (boardId, data) => {
  try {
    let listArray = [];

    data.sort((a, b) => {
      if (a.decade > b.decade) {
        return -1;
      }
      if (b.decade < a.decade) {
        return 1;
      }
      return 0;
    });

    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      if (index == 0 || element.decade != data[index - 1].decade) {
        let response = await axios.post(
          `https://api.trello.com/1/lists/?key=${
            process.env.TRELLO_KEY
          }&token=${process.env.TRELLO_TOKEN}&name=${encodeURI(
            element.decade
          )}&idBoard=${boardId}`
        );

        await createCards(
          response.data.id,
          data.filter((item) => item.decade == element.decade)
        );
      }
    }

    return {
      message: "Lists created",
      listArray: listArray,
    };
  } catch (err) {
    console.error({ message: "An error occurred creating the list.", err });
  }
};

//* Cards creation sorted by year
const createCards = async (listId, data) => {
  try {
    data.sort((a, b) => {
      if (a.year == b.year) {
        if (a.name < b.name) {
          return -1;
        }
        if (b.name > a.name) {
          return 1;
        }
        return 0;
      } else {
        if (a.year < b.year) {
          return -1;
        }
        if (b.year > a.year) {
          return 1;
        }
        return 0;
      }
    });

    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      let response = await axios.post(
        `https://api.trello.com/1/cards/?key=${process.env.TRELLO_KEY}&token=${
          process.env.TRELLO_TOKEN
        }&name=${encodeURI(element.year + " " + element.name)}&idList=${listId}`
      );

      //? Only unsplash urls are supported by Trello API: https://community.developer.atlassian.com/t/trello-rest-api-card-colors-covers/38865/11
      // if (response.status == 200) {
      //   axios.put(
      //     `https://api.trello.com/1/cards/${response.data.id}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
      //     {
      //       cover: {
      //         url: element.cover,
      //       },
      //     }
      //   );
      // }
    }

    return {
      message: "Cards created",
    };
  } catch (err) {
    console.error({ message: "An error occurred creating cards.", err });
  }
};

const create = async () => {
  try {
    let data = await fileController.readDiscography();
    let board = await createBoard();
    await createList(board.boardId, data);

    console.log("Process Finished");

    return {
      message: "Process Finished",
      status: 200,
    };
  } catch (err) {
    return {
      message: "Error",
      status: 500,
    };
  }
};

module.exports = {
  create,
};
