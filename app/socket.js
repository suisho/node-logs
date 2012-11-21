//socket
var socket_io = require('socket.io');
var config = require('./config');

var io = null;

var _blockTailing = {};

function setBlock(target){
  setTimeout(function(){
    _blockTailing[target] = false;
  },5000);
  _blockTailing[target] = true;
}
function hasIgnoreWord(){

}
exports.tail = function(data){
  //無視ワード
  var ignoreKeywords = config.get('ignore_keywords',[]);
  var ignoreSkip = false;
  ignoreKeywords.forEach(function(elm){
    if(data.line.indexOf(elm) > -1){
      ignoreSkip = true;
      console.log("skip ignore word",elm,data.line);
      return;
    }
  })
  if(ignoreSkip){
    return;
  }
  var highlightKeywords = config.get('highlight_keywords',[]);
  highlightKeywords.forEach(function(elm){
    if(data.line.indexOf(elm) > -1){
      data.level = "error";
    }
  })
  // 1秒程度notificationをブロックする。
  // ブロッキングはtargetごとで行う。
  io.sockets.emit('tail_raw', data); // ignore情報あたえたい
  var target = data.target;
  if(_blockTailing[target] == true){
    //console.log("skip");
    return;
  }

  console.log(target, data);
  setBlock(target);
  io.sockets.emit('tail', data);
};

exports.listen = function(server){
  console.log("listen socket");
  io = socket_io.listen(server);
  io.set("origin","*");
  io.set("log level",2);
  io.sockets.emit('connect', {});
}
