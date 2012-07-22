var config = require("../config.js");
//setting
exports.show = function(req, res){
  var targets = config.allTargets().join("\n")
  targets = targets+"\n"; // 設定時にちょっと良い
  var params = {
    targets : targets
  };
  res.render('setting', params);
}

exports.save = function(req, res){
  var params = req.body;
  var targetsString = params.targets.replace(/\r/g,"");
  var targetsArray = targetsString.split("\n");
  //空白行を取り除く
  targetsArray = targetsArray.filter(function(elm){
    return elm !== "";
  });
  config.set('targets', targetsArray);
  config.save();
  config.loadConfig();
  res.redirect('back');
}
