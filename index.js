'use strict';
const http = require('http');
const jade = require('jade');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'charset': 'utf-8'
  });

  switch (req.method) {
    case 'GET':
  switch (req.url) { //case 分けが始まります
    case '/enquetes/yaki-shabu': {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: '焼き肉',
          secondItem: 'しゃぶしゃぶ'
          
        }));
    }
        break;　//焼き肉かしゃぶしゃぶの url を受け取ったケース
      
    case '/enquetes/rice-bread': {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: 'ごはん',
          secondItem: 'パン'
        }));
    }
        break;　//ごはんかパンの url を受け取ったケース
    case '/enquetes/sushi-pizza':  {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: '寿司',
          secondItem: 'ピッツァ'
          
        }));
    }
        break; //寿司かピザの url を受け取ったケース
  }    //　case 分け終わり 
       // 14行目の波カッコと対応している
       // いつ14行目の波カッコを閉じるのか？分からず問題発生
       // ここの波カッコが、他の行にあったため無限ループしてバグりました。
       // case 分け終わる　→　res.endで処理を終わらす　→breakで抜ける
       // res.endについてイマイチ理解できていないため、誤解しているかもしれない。
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
