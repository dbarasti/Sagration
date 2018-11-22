var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var router = express.Router();

// Get the adodb module
const ADODB = require('node-adodb');

//const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=SagrationData2018.accdb;');
var connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=SagrationData2018.accdb;Persist Security Info=False;');

/**
Raccolgo in una variabile le condizioni di selezione delle statistiche 
che verranno inserite nella mappa e che verranno mostrate nella
pagina delle statistiche
*/
var queryStatistiche = new String('name = "Gnocchi" or name = "Costicina" or name = "Salsiccia" or name = "Quarto di pollo" or name = "Pancetta" or name = "Patatine"');   


//mappa l'id della tabella access al nome dell'ingrediente
var mappaIngredienti = new Map();
//per ogni id ingrediente associo la stringa rappresentante il nome dell'ingrediente
connection.
  query('SELECT ingredient_id, name FROM Ingredients WHERE ' + queryStatistiche + ' ORDER BY name')
  .then(data=>{
    //console.log(data);
    data.forEach(ingredient=>{
      mappaIngredienti.set(ingredient.ingredient_id, ingredient.name);
    })
    //console.log(mappaIngredienti);
  })
  .catch(error => {
    console.error(error);
  });


//variabile in cui salvare l' id dell'ultimo ordine "completato" per poter fare undo in caso di bisogno
var lastMarkedAsCompleted = null; //deve diventare una variabile, secondo issue #9

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
  res.status(200).render("stats",{mappaIngredienti: mappaIngredienti, stats:[]});
})

//è stata selezionato un tipo di statistica
router.get("/stats/:ingredientID", (req, res, next)=>{
  if(mappaIngredienti.get(req.params.ingredientID) == null){
    res.status(503).send("<h1>ERROR 503</h1> <h2>La statistica richiesta non è attualmente disponibile</h2> <h3>Controllare la sintassi della richiesta</h3>");
    return;
  }
  var statReq = req.params.ingredientID;

  //la query non va bene, va modificata per rispettare il requisito
  connection
  //SELECT dish_id, Items.nome, sum(quantity) as quantity from orders, Items WHERE orders.order_id = Items.order_id AND orders.consegnato = false AND orders.archiviato = false AND bar=false AND dish_id = '+ statReq + ' GROUP BY dish_id, Items.nome ORDER BY Items.nome
  .query('SELECT dish_id,Items.nome, sum(quantity) as quantità from Items,orders WHERE (orders.order_id = Items.order_id AND bar=false AND orders.consegnato=false) AND (Items.name = "Gnocchi" or Items.name = "Costicina" or Items.name = "Salsiccia" or Items.name = "Quarto di pollo" or Items.name = "Pancetta" or Items.name = "Patatine") GROUP BY dish_id, Items.nome ORDER BY Items.nome') //AND orders.archiviato=false
  .then(data => {
    //stampa il risultato della query
    console.log(data);
    res.render("stats", {mappaIngredienti: mappaIngredienti, stats: data});
  })
  .catch(error => {
    console.error(error);
  });
})


//ordini

router.get("/orders/:tipoVista", (req, res, next)=>{
  
  if(req.params.tipoVista == "todo")
  {
    connection
    .query('SELECT order_id,nome,totale_effettivo FROM orders WHERE orders.consegnato=false AND orders.archiviato=false ORDER BY order_id') // AND orders.archiviato=false
    .then(data => {
      res.render("orders", {tipoVista: "todo", ordini: data});
    })
    .catch(error => {
      console.error(error);
    });
  }
  if(req.params.tipoVista == "done"){
    connection
    .query('SELECT order_id,nome,totale_effettivo FROM orders WHERE orders.consegnato=true AND orders.archiviato=false ORDER BY order_id') // AND orders.archiviato=false
    .then(data => {
      res.render("orders", {tipoVista: "done", ordini: data});
    })
    .catch(error => {
      console.error(error);
    });
  }
})

router.get("/orders/completato/:order_id", (req, res, next)=>{ //sort by id TODO
  var id = parseInt(req.params.order_id);

  connection
  .query('SELECT order_id FROM orders WHERE (order_id='+ id + ' AND archiviato=false)') 
  .then(data =>{
    lastMarkedAsCompleted = data;
  })
  .catch(error => {
    console.error(error);
  });

  //console.log("stato connessione: "+ connection.;

  connection
  .execute('UPDATE orders SET consegnato = true WHERE order_id='+id)
  .catch(error => {
    console.error(error);

  });
  //lascio il tempo al db di aggiornarsi
  setTimeout(function(){res.status(200).redirect("/orders/todo");}, 100); 
})

//richiesta di dettaglio ordine

router.get("/detail/:orderID", (req,res,next)=>{
  connection
  .query('SELECT Items.nome, quantity FROM orders, Items WHERE (orders.order_id=Items.order_id AND Items.order_id=' + req.params.orderID + ' AND archiviato=false)')
  .then(data=>{
    res.send(data);
  })
  .catch(error => {
    console.error(error);
  });

})





//Ripristino ordini marcati come completati (consegnato=true nel DB)

router.get("/undoLastOrder", (req, res, next)=>{
  if(lastMarkedAsCompleted != null){
    var idToUndo = lastMarkedAsCompleted[0];
    lastMarkedAsCompleted = null;
    //stampa l'oggetto rappresentante l'ordine da ripristinare
    //console.log(idToUndo);
    connection
    .execute('UPDATE orders SET consegnato=false WHERE order_id='+idToUndo.order_id)
    .catch(error=>{
      console.error(error);
    });
  }
  setTimeout(function(){res.status(200).redirect("/orders/todo");}, 100);
})

router.get("/orders/ripristina/:orderID", (req, res, next)=>{
  idRipristino = parseInt(req.params.orderID);
  connection
  .execute('UPDATE orders SET consegnato=false WHERE order_id='+idRipristino)
  .catch(error=>{
    console.error(error);
  });
  
  setTimeout(function(){res.status(200).redirect("/orders/done");}, 100);
})


//404 page
router.use((req, res)=>{
    res.status(404).render("404");
});




module.exports = router;
