var app, appName, nibCompiler, environment, express, http, nib, path, stylus, options;

appName = "";
environment = null;
options = {};

express = require("express");
http = require("http");
path = require("path");
stylus = require("stylus");
nib = require("nib");
app = express();

switch ((app.settings.env || "unknown").toLowerCase()) {
  case "staging":
    environment = "staging";
    break;
  case "production":
    environment = "production";
    break;
  default:
    environment = "development";
    break;
}

nibCompiler = function(str, path) {
  return stylus(str).set("filename", path).set("compress", environment === "production").use(nib())["import"]("nib");
};

var cookieExpiration = 1 * 60 * 60 * 1000; // 1 hour // sliding in ms

app.configure(function() {
  app.set("name", appName);
  app.set("port", process.env.PORT || 3000);
  app.set("host", process.env.IP);
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(express.favicon(__dirname + "/public/img/favicon.ico"));
  app.use(express.logger("dev"));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'supersecretkeygoeshere'}));
  app.use(stylus.middleware({ src: __dirname + '/public', compile: nibCompiler }));
  app.use(express["static"](path.join(__dirname, "public"), { maxAge: 86400000 }));
  return app.use(app.router);
});

app.configure("development", function() {
  return app.use(express.errorHandler());
});

require("./routes/all")(app, options);
require("./routes")(app, options);

http.createServer(app).listen(app.get("port"), app.get("host"), function () {
  console.log("Environment Info:", process.env.NODE_ENV || app.settings.env);
  console.log("Express server listening on host and port: " + app.get("host") + ":" + app.get("port"));
  return;
});