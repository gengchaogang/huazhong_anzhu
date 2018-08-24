var liveServer = require("live-server");
var url = require('url');
var path = require('path');
// var multiparty = require('multiparty');
var querystring = require("querystring"),
  inspect = require('util').inspect,
  Busboy = require('busboy');

const mocksDir = process.argv[2];
let mocksPath = path.join(process.cwd(), mocksDir), mocks = null;
mocks = require(mocksPath);

function responseWithJson(res) {
  return {
    json: function (data) {
      console.log('Response data: ', data);
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(data));
    }
  };
}

function mockRequest(req) {
  let myreq = {};
  let urlObj = url.parse(req.url);
  if(urlObj.query) {
    myreq.query = urlObj.query;
  }
  var body = [];
  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    console.log(body);
    body = Buffer.concat(body).toString();
    console.log(JSON.parse(body));
    console.log(body);
  })


  return myreq;
}

function doAPIMock(req, res, next) {
  const pathname = url.parse(req.url).pathname;
  if(!pathname.startsWith('/api')) {
    next();
  }

  console.log(pathname);
  const handle = mocks[req.method + ' ' + pathname];
  if(handle) {
    console.log('handle is hit');
    // let myreq = {};
    let urlObj = url.parse(req.url);
    if(urlObj.query) {
      req.query = urlObj.query;
    }
    if(req.method === 'GET') {
      handle(req, responseWithJson(res));
    } else {
      if(req.headers['content-type'].startsWith('text/plain')) {
        let body = [];
        req.on('data', function(chunk) {
          body.push(chunk);
        }).on('end', function() {
          body = Buffer.concat(body).toString();
          // console.log('Body string: ' + body);
          try {
            body = querystring.parse(body);
          } catch (e) {
            body = {};
          } finally {
            console.log('Final request body is: ', body);
            req.body = body;
            handle(req, responseWithJson(res));
          }
        });
      } else {
        let busboy = new Busboy({ headers: req.headers });
        let body = {};
        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
          console.log('Field [' + fieldname + ']: value: ' + inspect(val));
          body[fieldname] = val;
        });
        busboy.on('finish', function() {
          req.body = body;
          handle(req, responseWithJson(res));
        });
        req.pipe(busboy);
      }
    }
  } else {
    console.log('No handle from this API request: ' + pathname);
  }

}

var params = {
    port: 3001, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: "src/backStage/mock", // Set root directory that's being server. Defaults to cwd.
    open: false, // When false, it won't load your browser by default.
    ignore: 'scss,my/templates', // comma-separated string for paths to ignore
    file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    mount: [['/components', './node_modules']], // Mount a directory to a route.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    middleware: [doAPIMock] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};

liveServer.start(params);
