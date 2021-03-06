const express = require("express");
require("dotenv").config();

const trelloController = require("./controllers/trello");

const app = express();

app.listen(3000, async () => {
  console.log("Process started");
  await trelloController.create();
  process.exit();
});
