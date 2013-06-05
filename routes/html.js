module.exports = function(app, options){
  app.get('/partials/:name', function(req, res){
    res.render('partials/'+req.params.name, options);
  });
}