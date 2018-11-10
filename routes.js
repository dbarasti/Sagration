var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var router = express.Router();

// Get the adodb module
const ADODB = require('node-adodb');

//const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=SagrationData2018.accdb;');
var connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=SagrationData2018.accdb;Persist Security Info=False;');

//mappa il nome dell'elemento all'id della tabella access
var mappaIngredienti = new Map();
mappaIngredienti.set("gnocchi",1);
mappaIngredienti.set("costicina",3);
mappaIngredienti.set("salsiccia",4);
mappaIngredienti.set("qrtDiPollo",5);
mappaIngredienti.set("pancetta",8);




router.use(function(req, res, next){
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
});

//homepage
router.get("/", function(req, res){
	console.log("Questa è la pagina di benveunto");
	res.send("landing page");
})

// Query the DB, this is a test
router.get('/testquery', (req, res) => {
  connection
  .query('SELECT * FROM Items')
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error(error);
  });
  res.send('tutti i dati della query sono disponibili sul log')
})


router.get("/stats/:statType", (req, res, next)=>{
  var statReq = parseInt(mappaIngredienti.get(req.params.statType));
  console.log(statReq);
  if(statReq == null){
    res.status(503).send("ERROR 503 </br> internal server error");
    return;
  }

  connection
  //.query('SELECT name FROM Ingredients WHERE ingredient_id='+statReq)
  .query('SELECT count (*) FROM orders, Items, Components, Ingredients WHERE orders.order_id=Items.order_id AND Items.dish_id=Components.dish_id AND Components.ingredient_id=Ingredients.ingredient_id AND orders.consegnato=false AND Ingredients.ingredient_id ='+statReq)
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error(error);
  });

  res.send("i dati sono disponibili nel log");
})















//404 page
router.use(function(request, response){
    response.status(404).send("ERROR 404 </br> content not found");
});


module.exports = router;
