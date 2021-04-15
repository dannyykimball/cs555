const express = require("express");
const app = express();
var fs = require("fs");

app.get("/", function (request, response) {
  var text = fs.readFileSync("./src/MyFamily.ged");
  var string = text.toString("utf-8");

  var textByLine = string.split("\n");
  console.log(textByLine);
  response.send(textByLine);
});

app.listen(4000, () => {
  console.log(`Example app listening at http://localhost:4000`);
});
