const fs = require('fs');
const { builtinModules } = require('module');
const TAGS = ['INDI','NAME','SEX','BIRT','DEAT','FAMC','FAMS','FAM','MARR','HUSB','WIFE','CHIL','DIV','DATE','HEAD','TRLR','NOTE'];

//run this to test the code
//File to be parsed must be in the same folder as this
function parseFile(fileName){
    //takes in a file name, then turns it into an array split by lines
    let fileText;
    fs.readFile(fileName,(e,data) => {
        if(e)
            throw e;
        fileText = data.toString();
        fileText = fileText.split('\r\n');
        for(let i = 0; i < fileText.length-1; i++){
            console.log("--> " + fileText[i]);
            output(fileText[i]);
        }
    });
    
}

//helper function
function output(text){
    //splits the lines into an array of strings, then makes sure the order is right and returns the formatted version
    let textArr = text.split(' ');
    let op = "<-- ";
    let valid = 'N';
    
    if(textArr.includes('INDI')){
        op = op.concat(textArr[0] + "|" + 'INDI' + '|' + 'Y');
        textArr.splice(textArr.indexOf('INDI'),1);
    }
    else if(textArr.includes('FAM')){
        op = op.concat(textArr[0] + "|" + 'FAM' + '|' + 'Y');
        textArr.splice(textArr.indexOf('FAM'),1);
    }
    else{
        if(TAGS.includes(textArr[1]))
            valid = 'Y'
        op = op.concat(textArr[0] + "|" + textArr[1] + "|" + valid);
        textArr.splice(1,1);
    }
        if(textArr.length > 1)
           op = op.concat('|');
        for(let i = 1; i < textArr.length; i++){
            op = op.concat(textArr[i]) + " ";
        }
        console.log(op);
}

//in case of running in another file
module.exports = {parseFile};