//socket
var socket_io = require('socket.io');

var io = null;

var _blockTailing = {};

function setBlock(target){
  setTimeout(function(){
    _blockTailing[target] = false;
  },1000);
  _blockTailing[target] = true;
}

exports.tail = function(data){
  // 1秒程度notificationをブロックする。
  // ブロッキングはtargetごとで行う。
  var target = data.target;
  if(_blockTailing[target] == true){
    //console.log("skip");
    return;
  }
  console.log(data);
  setBlock(data.target);
  io.sockets.emit('tail', data);
};

exports.listen = function(server){
  console.log("listen socket");
  io = socket_io.listen(server);
  io.set("origin","*");
  io.set("log level",2);
  io.sockets.emit('connect', {});
}
