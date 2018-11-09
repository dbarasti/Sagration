var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var router = express.Router();


router.use(function(req, res, next){
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
});

//homepage
router.get("/", function(req,res){
	console.log("Questa è la pagina di benveunto");
	res.send("landing page");
})


//404 page
router.use(function(request, response){
    response.status(404).send("ERROR 404 </br> content not found");
});


module.exports = router;