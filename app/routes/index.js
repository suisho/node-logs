
exports.index = function(req, res){
  res.render('index', { title: ''});
};

exports.notification = function(req, res){
  res.render('notification', req.query);
}
