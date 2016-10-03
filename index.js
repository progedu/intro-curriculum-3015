'use strict';
const http = require('http');
const jade = require('jade');

const survey = new Map(); // key:URL value:アンケート項目データのオブジェクト

survey.set('/enquetes/yaki-shabu', {w1:'焼肉', w2:'しゃぶしゃぶ'});
survey.set('/enquetes/rice-bread', {w1:'ごはん', w2:'パン'});
survey.set('/enquetes/sushi-pizza', {w1:'すし', w2:'ピザ'});
// survey.set('/enquetes/unko-curry', {w1:'ウ◯コ味のカレー', w2:'カレー味のウ◯コ'});


const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=UTF-8'　// 文字化け対策
//    'charset': 'utf-8'
  });

  switch (req.method) {
    case 'GET':

		try {
		const question = survey.get(req.url); // URLをキーにアンケート項目の単語を取得。
		res.write(jade.renderFile('./form.jade', {
					path: req.url,
					firstItem: question.w1 ,
					secondItem: question.w2
				}));
} catch (err){} 

      res.end();
      break;
    case 'POST':
      req.on('data', (data) => {
        const decoded = decodeURIComponent(data);
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
