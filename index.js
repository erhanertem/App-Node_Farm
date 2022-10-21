//NOTE: NodeJS is built around modules which provide distinct functionality. fs stands for file system which prvoides us functions like reading writing deleting files. We load the node functionality to a variable and call pertinent functions built around it.
const fs = require('fs'); //Acquire nodejs module and introduce to the file
const http = require('http'); //Acquire nodejs module which provides ability to build a http server
const url = require('url'); //Acquire nodejs module which provides ability to route to differing pages as response to server request by parsing the values entered to browser address

// //-->FILES

// //->Blocking Way - Synchronous
// //Read file synchronously
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// //Write to a file
// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// //->Non-blocking Wahy - Asynchronous
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//   //NOTE: We can call data or text ....But always first err
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

//--->SERVER
//-->#1 Create a server with routes for differing pages along with a fall-back error handler in the absence of a correct address

const replaceTemplate = (template, product) => {
  //VERY IMPORTANT! Its not a good practice to directly manipulate template HTML rather we replicated the manipulated version to a new variable called <output> from which we carried rest of the manuplations on it
  let output = template.replaceAll('{%PRODUCTNAME%}', product.productName);
  // output = output.replace(/{%IMAGE%}/g, product.image);// IMPORTANT! > global RegExp /.../g flag replaces all matching template placeholders.
  output = output.replaceAll('{%IMAGE%}', product.image);
  output = output.replaceAll('{%PRICE%}', product.price);
  output = output.replaceAll('{%FROM%}', product.from);
  output = output.replaceAll('{%NUTRIENTS%}', product.nutrients);
  output = output.replaceAll('{%QUANTITY%}', product.quantity);
  output = output.replaceAll('{%DESCRIPTION%}', product.description);
  output = output.replaceAll('{%ID%}', product.id);
  //ORGANIC IS A SPECIAL CASE. ITS SPECIFIED BOOLEAN VALUE IN THE JSON FILE WHICH DESIGNATES WHETHER THE ITEM GETS AN ORGANIC BADGE OR NOT VIA CSS CLASS MANIPULATION AS SEEN IN THE TEMPLATE FILES.
  if (!product.organic)
    output = output.replaceAll('{%NOT_ORGANIC%}', 'not-organic');

  return output;
};
//THE SUBPAGE TEMPLATES WOULD NEVER CHANGE. So we read it once and assign to an obj to be more performant.
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
//THIS IS DATA THAT DO NOT CHANGE! So we read it once and assign to an obj to be more performant.
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // We parse the read data to an obj.
// console.log('dataobj:', dataObj);

//We make use of http module to create server. Each time a request hits our server, the callback function of createServer is called.Req obj: We can request url, etc.Res obj: We have lots of tools available to deal with responses.
const server = http.createServer((req, res) => {
  // console.log(req); //prints the req obj
  // console.log('requested url:', req.url); //prints the parsed url
  // console.log('product click url object:', url.parse(req.url, true)); //Important This is a deprecated method.
  //Note: We take the url and parse as an object by designating the boolean parse value to true. By doing so, we acquire pathname as a seperate variable along with the path and query information.
  // console.log('request', req.headers.host);
  console.log(
    'product click url object:',
    new URL(req.url, 'http://localhost:8000') //Note: In lieu of deprecated url.parse() method. We create a new URL object from our request with a following base address
  );
  // const pathName = req.url;

  // const { query, pathName } = url.parse(req.url, true); //Deprecated method
  const { searchParams: query, pathname } = new URL(
    req.url,
    'http://localhost:8000'
  ); //NOTE: Per current node URL API, we parse the requested url (RELATIVE URL) into an URL constructor object along with the BASEURL (http://localhost:8000) and extract the definitions we are interested in.
  // console.log('searchparameters', searchParams.__proto__);
  /*
  INFORMATION
1) The url.parse(req.url) method is deprecated
the new way is using the URL constructor like so const myURL = new URL(absoluteURL)
or const myURL =new URL(relativeURL, baseURL)
2) The absoluteURL is a combination of the baseURL and the relativeURL/path.
the baseURL is something like this; http://127.0.0.1:8000
while the realtiveURL/path is something like this; /overview
the absoluteURL can be gotten by joining the baseURL and the relativeURL like this; http://127.0.0.1:8000/overview
All these information are stored in the req parameter of the callback function in the createServer() method
You can find the baseURL in req.headers.host
you can find the relativeURL in req.url
3) You can find the query and the pathname from the myURL object that is returned by the URL constructor in searchParams and in pathname respectively but searchParams is equal to URLSearchParams { 'id' => '0' } not 0 to get the id value which is equal to 0 use the get() method on the searchParams like this searchParams.get("id") // 0
So you can say
const pathname = myURL.pathname;
const query = myURL.searchParams.get("id");
console.log(myURL)
URL {
  href: 'http://127.0.0.1:8000/product?id=0',
  origin: 'http://127.0.0.1:8000',
  protocol: 'http:',
  username: '',
  password: '',
  host: '127.0.0.1:8000',
  hostname: '127.0.0.1',
  port: '8000',
  pathname: '/product',
  search: '?id=0', 
  searchParams: URLSearchParams { 'id' => '0' },  //query = searchParams.get("id")
  hash: ''
}
  */

  //->OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' }); //specify the data type that the response is about

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(''); //combined all mapped array elements into one chunk of string
    // console.log('cardsHTML:', typeof cardsHtml, cardsHtml);
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output); //respond with the rewritten template data specified
  }

  //->PRODUCT PAGE
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' }); //specify the data type that the response is about
    // const product = dataObj[query.id]; // We get a hang of the corrresponding JSON with the specified id/array order
    const product = dataObj[query.get('id')]; // We get a hang of the corrresponding JSON with the specified id/array order
    const output = replaceTemplate(tempProduct, product); //Replace the palceholders per the selected JSON item
    res.end(output); //respond with data specified
  }

  //->API
  else if (pathname === '/api') {
    // fs.readFile('./dev-data/data.json', 'utf-8', (err, data) => {
    //   const productData = JSON.parse(data);
    //   console.log(productData);
    // });
    // //IMPORTANT! In case node is initiated in a different directory, the root directory signified with <.> also points to the node server directory which renders the file location false. Therefore, we have a better way of typing this dynamically by using <__dirname> as follows
    // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
    //   const productData = JSON.parse(data); //NOTE: Use JSON.parse() to parse the response for AJAX. Use json() to parse the response for fetch. We translate the JSON data to a string that JS can acknowledge
    //   // console.log(productData);
    //   res.writeHead(200, { 'Content-type': 'application/json' }); //We mark the HEADER succesfull
    //   res.end(data); //We at the moment only send the raw JSON data back to the browser.
    // });
    res.writeHead(200, { 'Content-type': 'application/json' }); //We mark the HEADER succesfull
    res.end(data); //We at the moment only send the raw JSON data back to the browser.
  }

  //->NOT FOUND
  else {
    //IMPORTANT! HEADER NEEDS TO BE SEND OUT BEFORE A RESPONSE SENT OUT.
    res.writeHead(404, {
      'Content-type': 'text/html', //TELLS BROWSER WHATR TO EXPECT AS A RESPONSE
      // 'my-custom-header': 'hello-world', //HEADER publishes the error text - a meta data about the error
    }); //The browser developer panel console receives this message
    // res.end('Page not found');
    res.end('<h1>Page not found!</h1>');
  }
});

//-->#2 Start server listening @ port 8000 @ the current machine
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
