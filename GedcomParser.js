const fs = require("fs");

const TAGS = [
  "INDI",
  "NAME",
  "SEX",
  "BIRT",
  "DEAT",
  "FAMC",
  "FAMS",
  "FAM",
  "MARR",
  "HUSB",
  "WIFE",
  "CHIL",
  "DIV",
  "DATE",
  "HEAD",
  "TRLR",
  "NOTE",
];

function currentFamily() {
  this.ID = "";
  this.Married = "";
  (this.Divorced = "N/A"), (this.HusbandID = "");
  this.HusbandName = "";
  this.WifeID = "";
  this.WifeName = "";
  Children = [];
}

//run this to test the code
//File to be parsed must be in the same folder as this
function parseFile(fileName) {
  //takes in a file name, then turns it into an array split by lines
  let fileText;
  fs.readFile(fileName, (e, data) => {
    if (e) throw e;
    fileText = data.toString();
    fileText = fileText.split("\r\n");
    let segments = [];
    let segment = "";
    for (let i = 0; i < fileText.length - 1; i++) {
      if (fileText[i].includes("INDI")) {
        segments.push(segment);
        segment = "";
      }
      segment = segment + fileText[i] + " ";
    }
    segments.shift();

    let hashmap = new Map();

    for (i in segments) {
      hashmap = output(segments[i], hashmap);
    }

    console.log(hashmap.get("I20").Name);
    return hashmap;
  });
}

//helper function
function output(text, hashmap) {
  //splits the lines into an array of strings, then makes sure the order is right and returns the formatted version
  let textArr = text.split(" ");
  // console.log(textArr);
  let person = {
    ID: "",
    Name: "",
    Gender: "",
    Birthday: "",
    Age: "",
    Alive: true,
    Death: "",
    SpouseFamily: [],
    ChildOfFamily: [],
  };
  for (let i = 0; i < textArr.length; i++) {
    if (textArr[i].includes("INDI")) {
      person.ID = textArr[i - 1].replace("@", "").replace("@", "");
    } else if (textArr[i] == "NAME") {
      person.Name = textArr[i + 1];
      i++;
    } else if (textArr[i] == "SURN") {
      person.Name = person.Name + " " + textArr[i + 1];
      i++;
    } else if (textArr[i] == "SEX") {
      person.Gender = textArr[i + 1];
      i++;
    } else if (textArr[i] == "BIRT") {
      person.Birthday =
        textArr[i + 3] + " " + textArr[i + 4] + " " + textArr[i + 5];
      i = i + 5;
    } else if (textArr[i] == "DEAT") {
      person.Alive = false;
      person.Death =
        textArr[i + 4] + " " + textArr[i + 5] + " " + textArr[i + 6];
      i = i + 6;
    } else if (textArr[i].includes("FAMS")) {
      person.SpouseFamily = textArr[i + 1].replace("@", "").replace("@", "");
    } else if (textArr[i].includes("FAMC")) {
      person.ChildOfFamily = textArr[i + 1].replace("@", "").replace("@", "");
    }
  }

  hashmap.set(person.ID, person);

  return hashmap;
}

parseFile("MyFamily.ged");

//in case of running in another file
module.exports = { parseFile };
