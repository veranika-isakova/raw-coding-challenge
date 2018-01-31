const http = require('http')
const port = 3000
const url = require('url');
const fs = require('fs');
const mkdirp = require('mkdirp');

const requestHandler = (request, response) => {
  // We end our request here; please customise this to your own liking!
  response.setHeader('Content-Type', 'application/json');
  const purl=url.parse(request.url,true);

  if(purl.pathname=='/hello-world')
  response.end(JSON.stringify({'hello': 'world'}));

  else if (purl.pathname=='/hello-to-admins-only') {
    let body = [];
    request.on( 'data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      var jsonObj = JSON.parse(body)
      //console.log('jsonObj', jsonObj)
      //console.log('body', body)
      if(jsonObj.username === 'Karen' && jsonObj.password === 'ishouldbewelcome') {
        response.statusCode = 200;
        response.end(JSON.stringify({'message': 'Hello Karen'}));
      }
        else {
          response.statusCode = 401;
          response.end();
        }
    });
  }
  else
    response.end('Hello world!');
  }
  
const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err)
    return console.log('something bad happened', err)
})

// You need to export your application in order to be able to pass the tests!
module.exports = server;
