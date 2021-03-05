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
      if (fileText[i].includes("INDI") || fileText[i].includes("0 @F1@ FAM")) {
        segments.push(segment);
        segment = "";
      }
      segment = segment + fileText[i] + " ";
    }
    let relationships = segment;
    segments.shift();

    let hashmap = new Map();

    for (i in segments) {
      hashmap = output(segments[i], hashmap);
    }

    printMe(hashmap);
    //relationships
    let relaArr = relationships.split(" ");

    // console.log(relaArr);

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
    SpouseFamily: "",
    ChildOfFamily: "",
    SpouseID: "",
    Children: [],
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
      let monthConvert = new Map();
      monthConvert.set("JAN", 1);
      monthConvert.set("FEB", 2);
      monthConvert.set("MAR", 3);
      monthConvert.set("APR", 4);
      monthConvert.set("MAY", 5);
      monthConvert.set("JUN", 6);
      monthConvert.set("JUL", 7);
      monthConvert.set("AUG", 8);
      monthConvert.set("SEP", 9);
      monthConvert.set("OCT", 10);
      monthConvert.set("NOV", 11);
      monthConvert.set("DEC", 12);

      person.Birthday =
        monthConvert.get(textArr[i + 4]) +
        "/" +
        textArr[i + 3] +
        "/" +
        textArr[i + 5];
      i = i + 5;

      let today = new Date();
      let birthDate = new Date(person.Birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < 0)) {
        age--;
      }
      person.Age = age;
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

function printMe(hashmap) {
  console.log("#################################");
  console.log("# \t\t Individuals:");
  for (const [key, value] of hashmap) {
    console.log(value);
  }
  console.log("#################################");
}

parseFile("MyFamily.ged");

//in case of running in another file
module.exports = { parseFile };
