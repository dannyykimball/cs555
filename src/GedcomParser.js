const fs = require("fs");

//run this to test the code
//File to be parsed must be in the same folder as this
function parseFile(fileName) {
  //Sprint 1
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

    for (let i in segments) {
      hashmap = output(segments[i], hashmap);
    }

    for (const [key, value] of hashmap) {
      let fams = value.SpouseFamily;
      let famc = value.ChildOfFamily;
      for (const [key2, value2] of hashmap) {
        if (fams == value2.SpouseFamily && key != key2) {
          //set to each other
          hashmap.get(key).SpouseID = value2.ID;
          hashmap.get(key2).SpouseID = value.ID;
        }
        if (famc == value2.SpouseFamily && value2.SpouseFamily != "") {
          hashmap.get(key2).Children.push(value.ID);
        }
      }
    }

    //relationships
    let famHashmap = new Map();
    let relaArr = relationships.split(" 0 ");
    relaArr.pop();
    for (let i in relaArr) {
      let currentFam = {
        ID: "",
        MarriageDate: "NA",
        DivorcedDate: "NA",
        HusbID: "",
        HusbName: "",
        WifeID: "",
        WifeName: "",
        Children: [],
      };
      let line = relaArr[i].split(" ");

      for (let j = 0; j < line.length; j++) {
        if (line[j] == "FAM") {
          currentFam.ID = line[j - 1].replace("@", "").replace("@", "");
        } else if (line[j] == "HUSB") {
          currentFam.HusbID = line[j + 1].replace("@", "").replace("@", "");
          currentFam.HusbName = hashmap.get(currentFam.HusbID).Name;
          j++;
        } else if (line[j] == "WIFE") {
          currentFam.WifeID = line[j + 1].replace("@", "").replace("@", "");
          currentFam.WifeName = hashmap.get(currentFam.WifeID).Name;
          j++;
        } else if (line[j] == "CHIL") {
          currentFam.Children.push(
            line[j + 1].replace("@", "").replace("@", "")
          );
          j++;
        } else if (line[j] == "MARR") {
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

          currentFam.MarriageDate =
            monthConvert.get(line[j + 4]) +
            "/" +
            line[j + 3] +
            "/" +
            line[j + 5];
          j = j + 5;
        } else if (line[j] == "DIV") {
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

          currentFam.DivorcedDate =
            monthConvert.get(line[j + 4]) +
            "/" +
            line[j + 3] +
            "/" +
            line[j + 5];
          j = j + 5;
        }
      }
      famHashmap.set(currentFam.ID, currentFam);
    }

    printMe(hashmap);
    printFam(famHashmap);
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
  console.log(
    "####################################################################################################################################"
  );
  console.log("# \t\t Individuals:");
  console.log(
    "#   ID \t\t Name \t     Gender \t Birthday      Age\tAlive \t   Death\tSpouseID \t Children"
  );
  console.log("#");
  for (const [key, value] of hashmap) {
    console.log(
      "#   " +
        value.ID +
        "\t  " +
        value.Name +
        (value.Name.length < 14 ? "\t\t" : "\t") +
        value.Gender +
        "\t" +
        value.Birthday +
        "\t" +
        value.Age +
        "\t" +
        value.Alive +
        "\t   " +
        (value.Death.length < 1 ? "N/A" : value.Death) +
        (value.Death.length < 1 ? "\t\t" : "\t") +
        (value.SpouseID.length < 1 ? "N/A" : value.SpouseID) +
        "\t\t" +
        (value.Children.length < 1 ? "N/A" : value.Children)
    );
  }
  console.log(
    "####################################################################################################################################"
  );
}

function printFam(hashmap) {
  console.log(
    "####################################################################################################################################"
  );
  console.log("# \t\t Families:");
  console.log(
    "#   ID \t Married \t Divorced   HusbandID    Husband Name \t\t WifeID \t Wife Name \t\t Children"
  );
  console.log("#");
  for (const [key, value] of hashmap) {
    console.log(
      "#   " +
        value.ID +
        "\t  " +
        value.MarriageDate +
        (value.MarriageDate.length < 3 ? "\t\t" : "\t") +
        "\t" +
        value.DivorcedDate +
        "\t" +
        value.HusbID +
        "\t" +
        value.HusbName +
        (value.HusbName.length < 8 ? "\t\t\t" : "\t\t") +
        value.WifeID +
        "\t\t" +
        value.WifeName +
        (value.WifeName.length < 8
          ? "\t\t\t"
          : value.WifeName.length > 15
          ? "\t"
          : "\t\t") +
        (value.Children.length < 2 ? "N/A" : value.Children)
    );
  }
  console.log(
    "####################################################################################################################################"
  );
}

function upcomingBirthdays(hashmap) {
  //returns a list containing all the people who have a birthday within the next 30 days
  let uB = [];
  let today = new Date();
  //search through the birthdays of all people
  for (const [key, value] in hashmap) {
    //set the birthday to be this year
    let birthday = new Date(value.Birthday);
    birthday.setFullYear(today.getFullYear());
    //setting the day 30 days from now to check
    let future = new Date();
    future.setDate(future.getDate() + 30);
    //set upcoming birthday to be the difference between the birthday and today
    let ub = new Date(birthday - today);
    //check to see if the upcoming birthday is after today but within the next 30 days
    if (future > ub && ub > today)
      //add the birthday to the list of upcoming birthdays if it is
      uB.push(value);
  }
  //return all the birthdays
  return uB;
}

function birthBeforeMarriage(hashmap) {
  //checks to see if the individuals wedding day is after the day they were born
  for (const [key, value] in hashmap) {
    let b4 = [];
    let wedding = new Date(value.MarriageDate());
    let birth = new Date(value.birthDate);
    if (wedding - birth <= 0) b4.push(value);
  }
  return b4;
}

parseFile("MyFamily.ged");

//in case of running in another file
module.exports = { parseFile };
