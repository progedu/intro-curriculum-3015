'use strict';
const http = require('http');
const pug = require('pug');
var csvData;

const server = http.createServer((req, res) => {
  const now = new Date();
  const csv = 'select.csv';
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  function resWrite(firstItem,secondItem,url)
  {
    res.write(pug.renderFile('./form.pug', {
      path: url,
      firstItem: firstItem,
      secondItem: secondItem
    }));
    res.end();
  }

  //非同期処理で上手く動くようになるかも？
  function csvReader()
  {
    var csv = require('csv');
    var fs = require('fs');
    var parser = csv.parse({trim:true}, function(err,data){
      csvData = data;
    });
    
    fs.createReadStream('select.csv').pipe(parser);
    return csvData;
  }
console.info("メソッド: "+req.method);
  switch (req.method) {
    case 'GET':
      switch (req.url){
        case '/enquetes/sushi-pizza':
          resWrite("寿司","ピザ",req.url);
          break;
        case '/enquetes/yaki-shabu':
          resWrite("焼き肉","しゃぶしゃぶ",req.url);
          break;
        case '/enquetes/rice-bread':
          resWrite("コメ","パン",req.url);
          break;
      }
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