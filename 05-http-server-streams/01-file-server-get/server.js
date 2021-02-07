const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  const readFileFromFilesFolder = () => {
    if (pathname.indexOf('/') === -1) {
      const stream = fs.createReadStream(filepath);
      stream.pipe(res);
      stream.on('error', (err) => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('file not found');
        } else {
          res.statusCode = 500;
          res.end('Server error');
        }
      });
      stream.on('close', (() => {
        console.log('close');
      }));
      stream.on('open', (() => {
        console.log('open');
      }));
      req.on('aborted', () => {
        stream.destroy();
      });
    } else {
      res.statusCode = 400;
      res.end('path not found');
    }
  };

  switch (req.method) {
    case 'GET':
      readFileFromFilesFolder();
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
