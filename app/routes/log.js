var fs = require('fs');
var http = require('http');
var url = require('url');
var config = require('../config.js');

//browse
exports.browse = function(req, res){
  //ファイル中身取得（できればケツだけとりたい）
  //ケツの方だけ出す。
  //強調語設定
  var target = req.query.target
  var fileName = config.getFilePathByTarget(target); //ファイル名信用問題
  var tailString = "";
  var tailLines = [];
  var error = undefined;
  try{
    if(req.query.all == 1){
      tailString = fs.readFileSync(fileName, "UTF-8");
    }else{
      var length = 10000 || req.query.length;
      tailString = tailFileBytes(fileName, length);
    }

    tailLines = tailString.split("\n");
    if(req.query.all != 1){
      //tailLines.shift(); //なんとなく見た目カッコ悪いし別にあっても使える情報ではないので頭一行は切る
    }
  }catch(e){
    error = e;
  }

  var params = { tail_lines : tailLines,
                 target : target,
                 file_name : fileName,
                 all : req.query.all,
                 error : error
               };
  switch(req.format){
    case "json":
      res.json(params);
      break
    default:
      //メニューを出す
      params['target_all'] = config.allTargets();
      res.render('browse',params);
      break;
  }
}

/**
 * ファイルの末尾指定バイトを取得する
 * @param  {string} fileName
 * @param  {int}    lengthByte default:10000
 * @return {String}             \nで区切った文字
 */
function tailFileBytes(fileName, lengthByte){
  //ファイルの開始position
  var position = fs.statSync(fileName).size - lengthByte;
  return cutFile(fileName, position, lengthByte);
}

/**
 * ファイルのpositonからlengthの間切り出す
 * @param  {String} fileName
 * @param  {int} position   スタート位置
 * @param  {int} lengthByte 長さ
 * @return {String}
 */
function cutFile(fileName, position, lengthByte ){
  var fd = fs.openSync(fileName,'r');
  var buffer = new Buffer(lengthByte);

  //bufferに書き込む
  fs.readSync(fd, buffer, 0, lengthByte, position);

  var tail = buffer.toString("UTF-8");
  return tail;
}
