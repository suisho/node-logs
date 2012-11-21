var config = require("../config.js");
//setting
exports.show = function(req, res){
  var targets = config.get('targets',[]);
  var highlightKeywords = config.get('highlight_keywords',[]);
  var ignoreKeywords = config.get('ignore_keywords',[]);

  var params = {
    targets : targets,
    highlight_keywords : highlightKeywords,
    ignore_keywords : ignoreKeywords
  };
  switch(req.params.format){
    case "json":
      res.json(params);
      break
    default:
      res.render('setting', params);
      break;
  }
}

exports.save = function(req, res){
  var params = req.body;
  console.log(params);

  //set targets
  var targetsArray = strToArray(params.targets);
  config.set('targets', targetsArray);

  //set keywords;
  var highlightKeywords = strToArray(params.highlight_keywords);
  config.set('highlight_keywords', highlightKeywords);

  //set ignore;
  var ignoreKeywords = strToArray(params.ignore_keywords);
  config.set('ignore_keywords', ignoreKeywords);

  //save & reload
  config.save();
  config.loadConfig();
  res.redirect('back');
}

/**
 * str を\n区切りでarray化。空行は取り除く。
 * @param	  {String}	str
 * @returns	{Array}
 */
function strToArray(str){
  str = str.replace(/\r/g,"");
  var array = str.split("\n");
  //空白行を取り除く
  array = array.filter(function(elm){
    return elm !== "";
  });
  return array;
}
