'use strict';
const http = require('http');
const pug = require('pug');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info(`[ ${now} ] Request by ${req.connection.remoteAddress}`);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  switch (req.method) {
    case 'GET':
      let first = 'ああ';
      let second = 'いい';
      if (req.url === '/enquetes/yaki-shabu') {
        first = '焼き肉';
        second = 'しゃぶしゃぶ';
      } else if (req.url === '/enquetes/rice-bread') {
        first = 'ごはん';
        second = 'パン';
      } else if (req.url === '/enquetes/sushi-pizza') {
        first = '寿司';
        second = 'ピッツァ';
        } 
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          first,
          second
        }));
      res.end();
      break;
    case 'POST':
      let rawDate = '';
      req.on('data', (chunk) => {
        rawDate += chunk;
      }).on('end', () => {
        const qs = require('querystring');
				const decoded = decodeURIComponent(rawDate);
				console.info(`[ ${now} ] POSTED: ${decoded}`);
				const answer = qs.parse(decoded);
        res.write(`<!DOCTYPE html>
				<html lang="ja">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
				</head>
				<body>
					<h1>${answer['name']}さんは${answer['favorite']}に投稿しました</h1>
				</body>
				</html>`);
        res.end();
      });
      break;
    default:
      break;
  }
  }).on('error', e => {
      console.error(`[ ${new Date()} ] Server Error`, e);
  }).on('clienterror', e => {
      console.error(`[ ${new Date()} ] Client Error`, e);
  });
const port = 8000;
server.listen(port, () => {
    console.info(`[ ${new Date()} ] Listening On ${port}`);
});