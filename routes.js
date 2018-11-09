var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var router = express.Router();

// Get the adodb module
var ADODB = require('database-js-adodb');

//const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=SagrationData2018.accdb;');
var connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=SagrationData2018.accdb;Persist Security Info=False;');



router.use(function(req, res, next){
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
});

// Query the DB
app.get('/testquery', (req, res) => {
 connection
  .query('SELECT * FROM Items WHERE prezzo>9')
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error(error);
  });
  res.send('tutti i dati della query sono disponibili sul log')
})

//homepage
router.get("/", function(req, res){
	console.log("Questa è la pagina di benveunto");
	res.send("landing page");
})

router.get("/stats/:statType", function(req, res, next){

})



//404 page
router.use(function(request, response){
    response.status(404).send("ERROR 404 </br> content not found");
});


module.exports = router;