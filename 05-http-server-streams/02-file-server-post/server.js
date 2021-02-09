const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  const writeFileToFilesFolder = () => {
    const isFileExist = fs.existsSync(filepath);

    if (isFileExist) {
      res.statusCode = 409;
      res.end('file already exist');
    } else if (pathname.indexOf('/') !== -1) {
      res.statusCode = 400;
      res.end('wrong path');
    } else {
      if (!fs.existsSync('./files')) {
        fs.mkdirSync('./files');
      }

      const limitedStream = new LimitSizeStream(
          {limit: 1048576, objectMode: true}); // 1 Mb 1048576
      limitedStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          fs.unlinkSync(filepath);
          res.statusCode = 413;
          res.end('file too large');
        } else {
          res.statusCode = 500;
          res.end('limitedStream server error');
        }
      });

      const outStream = fs.createWriteStream(filepath);

      outStream.on('error', (err) => {
        res.statusCode = 500;
        res.end('outStream server error');
      });

      limitedStream.pipe(outStream);
      req.on('data', (chunk) => {
        limitedStream.write(chunk);
      });

      req.on('aborted', () => {
        fs.unlinkSync(filepath);
      });

      req.on('error', (err) => {
        res.statusCode = 500;
        res.end('server error');
      });

      req.on('end', () => {
        res.statusCode = 201;
        res.end();
      });
    }
  };

  switch (req.method) {
    case 'POST':
      writeFileToFilesFolder();
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
