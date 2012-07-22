var extend = require('node.extend')
var fs = require('fs');
var events = require("events");
var path = require('path');
var util = require('util');

module.exports = {
  config : {},
  targets : [],
  revTargetMap : {},
  filePath : "./config.json",
  eventEmitter : new events.EventEmitter(),
  init : function(){
  },

  defaultConfig : function(){
    return {
      port : 5607,
      target : {}
    }
  },

  loadConfig : function(){
    var json = fs.readFileSync(this.filePath,"utf8");
    var config = JSON.parse(json);

    var merged = extend(this.defaultConfgi, config);
    this.config = merged;
    this.targets = this.config.targets;
    this.createTargetMap();
    this.eventEmitter.emit('load');
  },

  get : function(key){
    return this.config[key];
  },

  set : function(key, value){
    this.config[key] = value
  },

  save : function(){
    var json = JSON.stringify(this.config,true,2);
    fs.writeFileSync(this.filePath,json);
  },

  createTargetMap : function(){
    var allTargets = this.allTargets();
    for(key in allTargets){
      var fileName = allTargets[key];
      this.revTargetMap[fileName] = key;

      var resolvedFilePath = path.resolve(fileName);
      this.revTargetMap[resolvedFilePath] = key;
    }
  },

  allTargets : function(){
    return this.targets;
  },

  getFilePathByTarget : function(target){
    return this.targets[target];
  },

  getTargetByFilePath : function(filePath){
    return this.revTargetMap[filePath];
  }
}
