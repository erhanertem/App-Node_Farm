//NOTE: NodeJS is built around modules which provide distinct functionality. fs stands for file system which prvoides us functions like reading writing deleting files. We load the node functionality to a variable and call pertinent functions built around it.
const fs = require('fs'); //Acquire nodejs module and introduce to the file
const http = require('http'); //Acquire nodejs module which provides ability to build a http server
const url = require('url'); //Acquire nodejs module which provides ability to route to differing pages as response to server request by parsing the values entered to browser address

// // -->FILES

// //Blocking Way - Synchronous
// //Read file synchronously
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// //Write to a file
// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

// //Non-blocking Wahy - Asynchronous
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//   console.log(data);
// });
// //We do not need to specify text encoding as in the sync version
// //NOTE: Callback functions used in nodejs functions typically gets (err,data)
// console.log('Will read file!');

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   //async readFile bears err, data
//   //handling error
//   if (err) return console.log('You encountered an error!🔔');

//   console.log(data1);
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     //handling error
//     if (err) return console.log('You encountered an error!🔔');

//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);
//       //handling error
//       if (err) return console.log('You encountered an error!🔔');

//       //Async write operation
//       fs.writeFile(
//         './txt/final.txt', //file to write to
//         `${data2}\n${data3}`, // what to write - simply the content
//         'utf-8', //txt encoding
//         error => {
//           //handling error
//           if (err) return console.log('You encountered an error!🔔');

//           console.log('The file has been written 🧿');
//         } //async writeFile bears ONLY error
//       );
//     });
//   });
// });
// console.log('Will read file!');

//-->SERVER

//->#1 Create a server
const server = http.createServer((req, res) => {
  // console.log(req.url); //prints the parsed url
  const pathName = req.url;
  if (pathName === '/' || pathName === '/overview') {
    res.end('This is the OVERVIEW PAGE');
  } else if (pathName === '/product') {
    res.end('This is the PRODUCT PAGE');
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-custom-header': 'hello-world', //HEADER publishes the error text - a meta data about the error
    }); //The browser developer panel console receives this message
    // res.end('Page not found');
    res.end('<h1>Page not found!</h1>');
  }
});

//->#2 Start server listening @ *** port
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
