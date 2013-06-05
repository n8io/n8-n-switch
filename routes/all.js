module.exports = function(app, options){
  app.all('*', function(req, res, next){
    // Perform any work that needs to be done each request
    return next();
  });
};