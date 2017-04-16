'use strict';
const http = require('http');
const jade = require('jade');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {
    case 'GET':
      if (req.url === '/enquetes/yaki-shabu') {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: '焼き肉',
          secondItem: 'しゃぶしゃぶ'
        }));
      } else if (req.url === '/enquetes/rice-bread') {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: 'ごはん',
          secondItem: 'パン'
        }));
      } else if (req.url === '/enquetes/sushi-pizza') {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: 'お寿司',
          secondItem: 'ピッツァ'
        }));
      } else {
        res.write('<h1>そんなページないです＞＜</h1>');
      }
      res.end();
      break;
    case 'POST':
      req.on('data', (q) => {
        const decoded = decodeURIComponent(q);
        let tmp1 = decoded.split('&');
        let data = {};
        for (let i = 0; i < tmp1.length; i++) {
          let tmp2 = tmp1[i].split('=');
          data[tmp2[0]] = tmp2[1];
        }
        console.info('[' + now + '] 投稿: ' + decoded);
        var html = `
          <!DOCTYPE html>
          <html lang="jp">
            <head>
              <meta charset="utf-8">
            </head>
            <body>
                <h1>${data["name"]}さんは、${data["favorite"]}が食べたいようです</h1>
            </body>
          </html>`;
        res.write(html);
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
