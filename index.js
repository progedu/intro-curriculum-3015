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
        let data = { path: req.url, };
        switch ((~~(10 * Math.random()))) {
          case 0:
            data["firstItem"] = '焼き肉';
            data["secondItem"] = 'しゃぶしゃぶ';
            break;

          case 1:
            data["firstItem"] = 'ごはん';
            data["secondItem"] = 'パン';
            break;

          case 2:
            data["firstItem"] = '犬 🐶';
            data["secondItem"] = '猫 🐈';
            break;

          case 3:
            data["firstItem"] = 'きのこの山';
            data["secondItem"] = 'たけのこの里';
            break;

          case 4:
            data["firstItem"] = '山';
            data["secondItem"] = '海';
            break;

          case 5:
            data["firstItem"] = 'ディズニーランド';
            data["secondItem"] = 'ディズニーシー';
            break;

          case 6:
            data["firstItem"] = '理系';
            data["secondItem"] = '文系';
            break;

          case 7:
            data["firstItem"] = '宇宙の旅';
            data["secondItem"] = '深海の旅';
            break;

          case 8:
            data["firstItem"] = '赤いきつね';
            data["secondItem"] = '緑のたぬき';
            break;

          case 9:
            data["firstItem"] = '実写映画';
            data["secondItem"] = 'アニメ映画';
            break;
        }
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
