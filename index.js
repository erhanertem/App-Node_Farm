const fs = require("fs"); //NOTE: NodeJS is built around modules which provide distinc functionality. fs stands for file system which prvoides us functions like reading writing deleting files.

//Read file synchronously
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);

//Write to a file
const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");
