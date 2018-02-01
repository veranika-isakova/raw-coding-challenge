const http = require('http')
const port = 3000
const url = require('url');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ffmpeg = require('fluent-ffmpeg');
const command = ffmpeg();

const download = function(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  const request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

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
  else if (purl.pathname=='/download-video') {
    download('http://s3.eu-central-1.amazonaws.com/flipbase-coding-challenge/bunny.mp4','./videos/bunny.mp4', () => {
      response.end();
    })
  }
  else if (purl.pathname=='/transcode-video') {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH=`/Users/veranika_isakova/Downloads/ffmpeg-3.4.1`);
  const command = ffmpeg('./videos/bunny.mp4');
   ffmpeg('./videos/bunny.mp4')
   .outputOptions([
     '-acodec libvorbis',
     '-vcodec libvpx-vp9',
     '-quality realtime',
     '-cpu-used 7',
   ])
   .output('./videos/transcoded_bunny.webm')
   .on('start', function(commandLine) {
     console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
    .on('progress', function(progress) {
      console.log(progress.timemark + ' seconds of the video are transcoded');
    })
    .on('error', (err) => {
      console.error(err)
    })

  command.getAvailableEncoders(function(err, encoders) {
  console.log('Available encoders:');
  console.dir(encoders);
  console.dir(err);
  })
  response.end('Hello Node.js Server!')
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
