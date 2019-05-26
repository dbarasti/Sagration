var express = require("express");
var path = require("path");
var session = require("express-session");
var flash = require("connect-flash");
var routes = require("./routes");

var app = express();

app.set("port", process.env.PORT || 8000);

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");    

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use(routes);

app.listen(app.get("port"), function(){
	console.log("server started on port " + app.get("port"));
});
