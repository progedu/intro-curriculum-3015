'use strict';
const fs = require('fs');

function handleFavicon(req, res) {
  res.writeHead(200, {
    'Content-type' : 'image/vnd.microsoft.icon'
  });
  const favicon = fs.readFileSync('./favicon.ico');
  res.end(favicon);
}

function handleNotFound(req, res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('ページがみつかりません');
}

module.exports = {
  handleFavicon,
  handleNotFound
}