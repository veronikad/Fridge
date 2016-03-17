global.__base = __dirname + "/";

var express = require("express"),
    router = require("./server/routes/router"),
    jade = require("jade");

var app = express();

 app.configure(function () {
	app.set("view engine", "jade");
    app.set("views", __dirname + "/server/views");
    //app.engine("html", jade.__express);

    app.use(express.static(__dirname + "/public"));
    app.use(express.cookieParser());
	app.use(express.bodyParser());
    router.init(app, express.session({ secret: "secret" })); //todo: value from pg-session
});

var listener = app.listen(process.env.PORT || 8081, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});