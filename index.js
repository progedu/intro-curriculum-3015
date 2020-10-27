'use strict';
const http = require('http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':

        let data = { path: req.url };
        switch (req.url) {
          case '/enquetes/yaki-shabu':
            data['title'] = 'どちらが食べたいですか？';
            data['firstItem'] = '焼き肉';
            data['secondItem'] = 'しゃぶしゃぶ';
            break;
          case '/enquetes/rice-bread':
            data['title'] = 'どちらが食べたいですか？';
            data['firstItem'] = 'ごはん';
            data['secondItem'] = 'パン';
            break;
          case '/enquetes/go-or-not':
            data['title'] = 'どうやってハロウィンを過ごしますか？';
            data['firstItem'] = '渋谷にいく';
            data['secondItem'] = '家で楽しむ';
            break;
          default:
            console.log('aaaa');
            break;
        };
        res.write(pug.renderFile('./form.pug', data));
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData = rawData + chunk;
          })
          .on('end', () => {
            const qs = require('querystring');
            const answer = qs.parse(rawData);
            const body = answer['name'] + 'さんは' +
              answer['favorite'] + 'に投票しました';
            console.info('[' + now + '] ' + body);
            res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
              body + '</h1></body></html>');
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error('[' + new Date() + '] Server Error', e);
  })
  .on('clientError', e => {
    console.error('[' + new Date() + '] Client Error', e);
  });
const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});
