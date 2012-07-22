//tailf.jsのほうがいいかも
var path = require('path');

exports.callback = function(){};
exports.targets = [];

exports.start = function(){
  var config = require("./config");
  config.config.targets.forEach(function(file){
    var tail = require('tailfd').tail;
    var resolvedFilePath = path.resolve(file);
    tail(resolvedFilePath, function(line, tailInfo){
      var target = config.getTargetByFilePath(file);
      exports.callback(null, { target :target, file: file, line : line});
    });
  });
};
