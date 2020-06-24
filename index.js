'use strict';
const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
  fs.readFile('./kanji.html', 'utf-8', function(err, data) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
    res.write(data);
    res.end();
});

});

server.listen(8000);
console.info('Listening on ' + 8000)