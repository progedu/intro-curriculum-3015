'use strict';
const http = require('http');
const pug = require('pug');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {
    case 'GET':
      if (req.url === '/') {
        const fs = require('fs');//ルートにアクセスされたらメニューを表示する
        const rs = fs.createReadStream('./menu.html');
        rs.pipe(res);
        break;
      } else if (req.url === '/enquetes/yaki-shabu') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: '焼き肉',
          secondItem: 'しゃぶしゃぶ',
          anotherAnquetePath: '../enquetes/rice-bread' //別のアンケートへのパスを追加
        }));
      } else if (req.url === '/enquetes/rice-bread') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: 'ごはん',
          secondItem: 'パン',
          anotherAnquetePath: '../enquetes/sushi-pizza'
        }));
      } else if (req.url === '/enquetes/sushi-pizza') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: '寿司',
          secondItem: 'ピザ',
          anotherAnquetePath: '../enquetes/yaki-shabu'
        }));
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
        const favoritItem = decoded.match(/favorite=(.+?)$/); //アンケート結果のValueを抜き出し
        let anotherAnquetePath;
        if (req.url === '/enquetes/yaki-shabu') { //別のアンケートのパスを渡す
          anotherAnquetePath = '../enquetes/rice-bread';
        } else if (req.url === '/enquetes/rice-bread') {
          anotherAnquetePath = '../enquetes/sushi-pizza';
        } else if (req.url === '/enquetes/sushi-pizza') {
          anotherAnquetePath = '../enquetes/yaki-shabu';
        }
        res.write(pug.renderFile('./result.pug', { //結果表示用のresult.pugを呼び出す
          favoritItem: favoritItem[1],//アンケート結果を渡す
          anotherAnquetePath: anotherAnquetePath

        }));
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
