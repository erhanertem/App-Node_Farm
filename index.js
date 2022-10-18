const { Console } = require("console");
const fs = require("fs");
//NOTE: NodeJS is built around modules which provide distinct functionality. fs stands for file system which prvoides us functions like reading writing deleting files. We load the node functionality to a variable and call pertinent functions built around it.

// //Blocking Way - Synchronous
// //Read file synchronously
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// //Write to a file
// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

//Non-blocking Wahy - Asynchronous
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
	console.log(data);
});
//We do not need to specify text encoding as in the sync version
//NOTE: Callback functions used in nodejs functions typically gets (err,data)
console.log("Will read file!");
