const http = require('http')
const port = 3000
const url = require('url');


const requestHandler = (request, response) => {
  // We end our request here; please customise this to your own liking!
  response.setHeader('Content-Type', 'application/json');
  const purl=url.parse(request.url,true);

  if(purl.pathname=='/hello-world')
  response.end(JSON.stringify({'hello': 'world'}));

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
