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
			let firstItem = 'remi';
			let secondItem = 'megu';
			if (req.url === '/enquetes/yaki-shabu') {
				firstItem = 'やきにく';
				secondItem = 'しゃぶしゃぶ';
			} else if (req.url === '/enquetes/rice-bread') {
					firstItem = 'ごはん';
					secondItem = 'パン';
			} else if (req.url === '/enquetes/sushi-pizza') {
        firstItem = '寿司',
        secondItem = 'ピザ'
      }
				res.write(pug.renderFile('./form.pug', {
					path: req.url,
					firstItem: firstItem,
					secondItem: secondItem
        }));
      res.end();
      break;
    case 'POST':
      let rawData = '';
      req.on('data', (chunk) => {
        rawData = rawData + chunk;
      }).on('end', () => {
        const decoded = decodeURIComponent(rawData);
        console.info('[' + now + '] 投稿: ' + decoded);
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
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