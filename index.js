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
        if (req.url === '/enquetes/tasty-red') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: 'とまと',
              secondItem: 'すいか',
              thirdItem: 'いちご',
              fourthItem: '赤牛',
              fifthItem: '天草大王(赤鶏)',
              sixthItem: '車海老'
            })
          );
        } else if (req.url === '/enquetes/tasty-black') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: '黒豚',
              secondItem: '黒毛和牛',
              thirdItem: '黒さつま鶏',
              fourthItem: '黒酢',
              fifthItem: 'うなぎ',
              sixthItem: 'クロマグロ'
            })
          );
        }
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
            const body = answer['ニックネーム'] + 'さんより' +
              answer['favorite'] + 'のご応募をお受けいたしました。<br>ありがとうございました！';
            console.info('[' + now + '] ' + body);
            res.write('<!DOCTYPE html><html lang="ja"><style>body{background-color:#FF9872;}</style><body><h1 align="center">' +
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