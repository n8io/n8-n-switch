module.exports = function(app, options){
  app.get('/', function(req, res){
    res.render('home/index', options);
  });
  app.get('/:whatever', function(req, res){
    res.render('home/index', options);
  });
}