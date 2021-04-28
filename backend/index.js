const express = require("express");
const app = express();
var fs = require("fs");

const familyData = require("./data/family");
// Enable CORS for all methods
app.use(function (request, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  //intercept the OPTIONS call so we don't double up on calls to the integration
  if ("OPTIONS" === request.method) {
    res.send(200);
  } else {
    next();
  }
});

app.get("/", async function (request, response) {
  var text = fs.readFileSync("./data/MyFamily.ged");
  var string = text.toString("utf-8");
  var textByLine = string.split("\n");

  await familyData.clear();
  const familyHashmap = createHashmap(textByLine);

  await familyData.addFamily(familyHashmap);

  response.send(await familyData.getAllFamily());
});

function createHashmap(arr) {
  let familyHashmap = new Map();

  var familyMember = {};
  var wholeFamily = {};

  for (let i = 0; i < arr.length; i++) {
    //configure each line
    arr[i] = arr[i].substring(0, arr[i].length - 1);
    let currentLine = arr[i].split(" ");

    // push member
    if (currentLine.includes("INDI") || currentLine[1] == "@F1@") {
      if (currentLine[1] == "@F1@") {
        wholeFamily.ID = currentLine[1].replace("@", "").replace("@", "");
      }
      if (familyMember.ID != undefined) {
        if (!familyMember.Death) {
          familyMember.Death = "N/A";
        }
        familyHashmap.set(
          familyMember.ID.replace("@", "").replace("@", ""),
          familyMember
        );
      }

      //clear and reset with just ID
      familyMember = {};
      familyMember.ID = currentLine[1].replace("@", "").replace("@", "");
      continue;
    }

    //add data
    if (currentLine.includes("NAME")) {
      familyMember.Name =
        currentLine[2] + " " + currentLine[3].replace("/", "").replace("/", "");
      continue;
    }
    if (currentLine.includes("SEX")) {
      familyMember.Gender = currentLine[2];
      continue;
    }
    if (currentLine.includes("BIRT")) {
      let date = arr[i + 1].substring(7, arr[i + 1].length - 1);
      familyMember.Birthday = date;

      let today = new Date();
      let birthDate = new Date(familyMember.Birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < 0)) {
        age--;
      }
      familyMember.Age = age;

      continue;
    }
    if (currentLine.includes("DEAT")) {
      let date = arr[i + 1].substring(7, arr[i + 1].length - 1);
      familyMember.Death = date;
      continue;
    }
    if (currentLine.includes("FAMS")) {
      familyMember.SpouseFamily = currentLine[2]
        .replace("@", "")
        .replace("@", "");
      continue;
    }
    if (currentLine.includes("FAMC")) {
      familyMember.ChildOfFamily = currentLine[2]
        .replace("@", "")
        .replace("@", "");
      continue;
    }

    // push family
    if (currentLine.includes("FAM")) {
      if (wholeFamily.ID != undefined) {
        familyHashmap.set(
          wholeFamily.ID.replace("@", "").replace("@", ""),
          wholeFamily
        );
      }

      //clear and reset with just ID
      wholeFamily = {};
      wholeFamily.ID = currentLine[1].replace("@", "").replace("@", "");
      continue;
    }

    //add data
    if (currentLine.includes("MARR")) {
      let date = arr[i + 1].substring(7, arr[i + 1].length - 1);
      wholeFamily.MarriageDate = date;
      continue;
    }
    if (currentLine.includes("DIV")) {
      let date = arr[i + 1].substring(7, arr[i + 1].length - 1);
      wholeFamily.DivorcedDate = date;
      continue;
    }
    if (currentLine.includes("HUSB")) {
      wholeFamily.HusbID = currentLine[2].replace("@", "").replace("@", "");
      wholeFamily.HusbName = familyHashmap.get(wholeFamily.HusbID).Name;
      continue;
    }
    if (currentLine.includes("WIFE")) {
      wholeFamily.WifeID = currentLine[2].replace("@", "").replace("@", "");
      wholeFamily.WifeName = familyHashmap.get(wholeFamily.WifeID).Name;
      continue;
    }
    if (currentLine.includes("CHIL")) {
      if (wholeFamily.Children) {
        wholeFamily.Children.push(
          currentLine[2].replace("@", "").replace("@", "")
        );
      } else {
        wholeFamily.Children = [
          currentLine[2].replace("@", "").replace("@", ""),
        ];
      }
      continue;
    }
  }
  familyHashmap.set(
    wholeFamily.ID.replace("@", "").replace("@", ""),
    wholeFamily
  );

  return familyHashmap;
}

app.listen(4000, () => {
  console.log(`Backend listening at http://localhost:4000`);
});
