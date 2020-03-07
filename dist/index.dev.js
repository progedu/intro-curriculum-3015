'use strict';

var http = require('http');

var pug = require('pug');

var server = http.createServer(function (req, res) {
  var now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {
    case 'GET':
      if (req.url === '/enquetes/yaki-shabu') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: '焼き肉',
          secondItem: 'しゃぶしゃぶ'
        }));
      } else if (req.url === '/enquetes/rice-bread') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: 'ごはん',
          secondItem: 'パン'
        }));
      } else if (req.url === '/enquetes/sushi-pizza') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: '寿司',
          secondItem: 'ピザ'
        }));
      }

      res.end();
      break;

    case 'POST':
      var rawData = '';
      req.on('data', function (chunk) {
        rawData = rawData + chunk;
      }).on('end', function () {
        var decoded = decodeURIComponent(rawData);
        console.info('[' + now + '] 投稿: ' + decoded);
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' + decoded + 'が投稿されました</h1></body></html>');
        res.end();
      });
      break;

    default:
      break;
  }
}).on('error', function (e) {
  console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', function (e) {
  console.error('[' + new Date() + '] Client Error', e);
});
var port = 8000;
server.listen(port, function () {
  console.info('[' + new Date() + '] Listening on ' + port);
});