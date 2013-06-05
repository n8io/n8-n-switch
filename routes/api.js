var request = require('request');
var parseString = require('xml2js').parseString;

module.exports = function(app, options){
  app.get('/api/:user/:pwd/:url/:port/devices', function(req, res){
    // http://admin:085221/204.210.194.43:9876/rest/nodes
    var url = 'http://'+
      req.params.user + ':' +
      req.params.pwd + '@' +
      req.params.url + ':' +
      req.params.port + '/rest/nodes'

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        parseString(body, function (err, result) {
          if(!err){
            res.json(result);
          }
          else{
            res.status = 500;
            res.json({statusCode:500,message:error});
          }
        });
      }
      else{
        res.status = 500;
        res.json({statusCode:500,message:error});
      }
    })
  });
  app.get('/api/:user/:pwd/:url/:port/:device/:cmd', function(req, res){
    // http://admin:085221/204.210.194.43:9876/rest/nodes/17 02 32/cmd/DFOF
    var url = 'http://'+
      req.params.user + ':' +
      req.params.pwd + '@' +
      req.params.url + ':' +
      req.params.port + '/rest/nodes/' +
      req.params.device + '/cmd/' +
      req.params.cmd;

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        parseString(body, function (err, result) {
          if(!err){
            res.json(result);
          }
          else{
            res.status = 500;
            res.json({statusCode:500,message:error});
          }
        });
      }
      else{
        res.status = 500;
        res.json({statusCode:500,message:error});
      }
    })
  });
}