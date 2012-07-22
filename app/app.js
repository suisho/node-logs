var fs = require('fs');
var express = require('express');

var app = module.exports = express.createServer();

var config = require('./config.js');
config.init();
config.loadConfig();

// Configuration
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '../../client'));
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.set('view options',{layout: false});
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register('html', require("jqtpl").express);
  app.register('js', require("jqtpl").express);
});

app.configure('development', function(){
  console.log("development mode");
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});

//routing
var routes = require('./routes');
var setting = require('./routes/setting');
app.get('/', routes.index);
app.get('/notification', routes.notification);
app.get('/browse(.:format)?', routes.browse);
app.get('/setting/show', setting.show);
app.post('/setting/save', setting.save);

//listen socket
var socket = require("./socket.js");
socket.listen(app);

exports.tailf = require('./tail');
// tailで変更があったとき
exports.tailf.callback = function(error, data){
  socket.tail(data);
}

exports.tailf.start();

//config再読み込みがあったら行う
config.eventEmitter.on('load',function(){
  console.log("reload config");
  exports.tailf.start();
});
