var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var router = express.Router();

// Get the adodb module
const ADODB = require('node-adodb');

//const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=SagrationData2018.accdb;');
var connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=SagrationData2018.accdb;Persist Security Info=False;');

//mappa il nome dell'elemento all'id della tabe qlla access
var mappaIngredienti = new Map();
mappaIngredienti.set("gnocchi",1);
mappaIngredienti.set("costicina",3);
mappaIngredienti.set("salsiccia",4);
mappaIngredienti.set("qrtDiPollo",5);
mappaIngredienti.set("pancetta",8);

//lista in cui pushare gli id degli ordini per poter fare undo in caso di bisogno
var ordiniUndo = new Array();

router.use(function(req, res, next){
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
});

//homepage
router.get("/", (req, res)=>{
	res.status(200).render("homepage");
})


//statistiche

router.get("/stats", (req, res, next)=>{
  res.status(200).render("stats",{richiesta:null, stats:[]});
})

//è stata selezionato un tipo di statistica
router.get("/stats/:statType", (req, res, next)=>{
  if(mappaIngredienti.get(req.params.statType) == null){
    res.status(503).send("<h1>ERROR 503</h1> <h2>La statistica richiesta non è attualmente disponibile</h2> <h3>Controllare la sintassi della richiesta</h3>");
    return;
  }
  var statReq = parseInt(mappaIngredienti.get(req.params.statType));

  connection
  //old query: SELECT count (*) FROM orders, Items, Components, Ingredients WHERE orders.order_id=Items.order_id AND Items.dish_id=Components.dish_id AND Components.ingredient_id=Ingredients.ingredient_id AND orders.consegnato=false AND Ingredients.ingredient_id ='+statReq
  .query('SELECT dish_id, Items.nome, sum(quantity) as quantity from orders, Items WHERE orders.order_id = Items.order_id AND orders.consegnato = false AND orders.archiviato = false AND bar=false AND dish_id = '+ statReq + ' GROUP BY dish_id, Items.nome ORDER BY Items.nome')
  .then(data => {
    console.log(data);
    res.render("stats", {stats: data});
  })
  .catch(error => {
    console.error(error);
  });
})


//ordini

router.get("/orders", (req, res, next)=>{
  connection
  .query('SELECT order_id,nome,totale_effettivo FROM orders WHERE orders.consegnato=false') // AND orders.archiviato=false
  .then(data => {
    res.render("orders", {ordini: data});
  })
  .catch(error => {
    console.error(error);
  });
})

router.get("/orders/completato/:order_id", (req, res, next)=>{ //sort by id TODO
  var id = parseInt(req.params.order_id);

  connection
  .query('SELECT DISTINCT order_id FROM orders WHERE order_id ='+ id + ' SORT BY order_id')
  .then(data =>{
    ordiniUndo.push(data);
  })
  .catch(error => {
    console.error(error);
  });

  //console.log("stato connessione: "+ connection.;

  connection
  .query('UPDATE orders SET consegnato = true WHERE order_id='+id)
  .catch(error => {
    console.error(error);

  });
  //lascio il tempo al db di aggiornarsi
  setTimeout(function(){res.status(200).redirect("/orders");}, 100); 
})

router.get("/orders/undo", (req, res, next)=>{
  if(ordiniUndo.length > 0){
    var idToUndo = ordiniUndo.pop()[0];
    console.log(idToUndo);
    connection
    .query('UPDATE orders SET consegnato=false WHERE order_id='+idToUndo.order_id)
    .catch(error=>{
      console.error(error);
    });
  }
  setTimeout(function(){res.status(200).redirect("/orders");}, 100);
})




//404 page
router.use((req, res)=>{
    res.status(404).render("404");
});




module.exports = router;
