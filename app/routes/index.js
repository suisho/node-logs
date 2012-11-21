var config = require("../config.js");

exports.index = function(req, res){
  res.render('index', { title: ''});
};

exports.notification = function(req, res){
  var level = "info";
  switch(req.query.level){
    case "critical":
    case "error":
      level = "error";
      break;
    case "warn":
    case "warning":
      level = "warn";
  }
  req.query.level = level;
  res.render('notification', req.query); //req.query直渡しははたしてどうなのか
}

