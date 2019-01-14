'use strict';
const http = require('http');
const pug = require('pug');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  /**
   * アンケートを追加する
   * @param {string} path リクエストされたパス名
   * @param {string} fItem 一つ目の選択肢
   * @param {string} sItem 二つ目の選択肢
   */
  function addEnquete (path, first_item, second_item) {
    return res.write(pug.renderFile('./form.pug', {
      path: path,
      firstItem: first_item,
      secondItem: second_item
    }));
  }

  switch (req.method) {
    case 'GET':
      if (req.url === '/enquetes/yaki-shabu') {
        addEnquete(req.url, '焼肉', 'しゃぶしゃぶ');
      } else if (req.url === '/enquetes/rice-bread') {
        addEnquete(req.url, 'ごはん', 'パン');
      } else if (req.url === '/enquetes/sushi-pizza') {
        addEnquete(req.url, '寿司', 'ピザ');
      }
      res.end();
      break;
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        const decoded = decodeURIComponent(body);
        console.info('[' + now + '] 投稿: ' + decoded);
        res.write('<!DOCTYPE html><html lang="jp"><head><meta charset="utf-8"></head><body><h1>' +
          decoded + 'が投稿されました</h1></body></html>');
        res.end();
      });
      break;
    default:
      break;
  }

}).on('error', (e) => {
  console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
  console.error('[' + new Date() + '] Client Error', e);
});
const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});
