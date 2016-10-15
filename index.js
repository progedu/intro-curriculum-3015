'use strict';
const http = require('http');
const jade = require('jade');

const survey = new Map(); // key:URL value:アンケート項目データのオブジェクト

survey.set('/enquetes/yaki-shabu', { w1: '焼肉', w2: 'しゃぶしゃぶ' });
survey.set('/enquetes/rice-bread', { w1: 'ごはん', w2: 'パン' });
survey.set('/enquetes/sushi-pizza', { w1: '寿司', w2: 'ピザ' });
survey.set('/enquetes/udon-soba', { w1: 'うどん', w2: 'そば' });
// survey.set('/enquetes/unko-curry', {w1:'ウ◯コ味のカレー', w2:'カレー味のウ◯コ'});


const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=UTF-8'　// 文字化け対策
    //    'charset': 'utf-8'
  });

  function nico(word) { // 検索ワードから再生数の多い動画のiframe用のURLを取得したかった。
    return new Promise(function (resolve) {
      let http = require('http');

      // ニコニコv2の api? のURL
      const constUrl = 'http://api.search.nicovideo.jp/api/v2/video/contents/search?q='

      // 検索条件。　正直よくわからん
      const sOption = '&targets=tagsExact&fields=contentId&_sort=-mylistCounter&_offset=0&_limit=1&_context=intro-curriculum-3015'

      // 検索ワードをURIエンコード
      const text = encodeURIComponent(word);
      let URL = constUrl + text + sOption;

      http.get(URL, (res) => {
        let body = '';  // 戻ってきたデータの入れ物
        res.setEncoding('UTF-8'); // 文字コードをいつものアレに

        res.on('data', (chunk) => {
          body += chunk;      // データがいっぺんに来ないから，ちょっとずつ貯めていくよ！
        });

        res.on('end', (res) => {
          res = JSON.parse(body); // JSON形式に。

          const data = res.data; // res の配列のデータを取り出します。
          URL = 'http://ext.nicovideo.jp/thumb/' + data[0].contentId; // iframe 用のURLを作るよ
          resolve(URL);
        });
      }).on('error', (e) => {
        console.log(e.message); //エラーの時はメッセージ
      });
    });
  }


  switch (req.method) {
    case 'GET':

      try {
        const question = survey.get(req.url); // URLをキーにアンケート項目の単語を取得。

        var nicoUrl = [
          nico(question.w1),
          nico(question.w2)
        ];

        Promise.all(nicoUrl).then(function (results) {
          res.write(jade.renderFile('./form.jade', {
            path: req.url,
            firstItem: question.w1,
            secondItem: question.w2,
            firstURL: results[0],
            secondURL: results[1]
          }));
        },function(reject){
          res.write(jade.renderFile('./form.jade', {
            path: req.url,
            firstItem: question.w1,
            secondItem: question.w2,
            firstURL: '',
            secondURL: ''
          }));
        });
      } catch (err) {
        res.end();
      }
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
