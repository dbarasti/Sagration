let express = require("express");
let datetime = require('date-and-time');
let router = express.Router();

// Get the adodb module
const ADODB = require('node-adodb');

//da modificare per puntare al database di produzione
let connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=SagrationData2018.accdb;Persist Security Info=False;');

/*
Raccolgo in una letiabile le condizioni di selezione delle statistiche 
che verranno inserite nella mappa e che verranno mostrate nella
pagina delle statistiche
*/
let queryStatistiche = new String('Ingredients.name = "Gnocchi" or Ingredients.name = "Costicina" or Ingredients.name = "Salsiccia" or Ingredients.name = "Quarto di pollo" or Ingredients.name = "Pancetta" or Ingredients.name = "Patatine"');   


let tempoMedioAttesa = 0;

//mappa l'id della tabella access al nome dell'ingrediente
let mappaIngredienti = new Map();
let mappaPiattiBloccati = new Map();
let mappaPiatti = new Map();

//per ogni id ingrediente associo la stringa rappresentante il nome dell'ingrediente
connection.
  query(`SELECT ingredient_id, name FROM Ingredients ORDER BY name`)
  .then(data=>{
    data.forEach((ingredient)=>{
      mappaIngredienti.set(ingredient.ingredient_id, ingredient.name);
    })
  })
  .catch(error => {
    console.error(error);
  });

//per ogni id piatto associo la stringa rappresentante il nome del piatto
connection.
  query(`SELECT dish_id, nome, bloccato FROM Dishes WHERE bar=false ORDER BY nome`)
  .then(dishes=>{
    dishes.forEach((dish)=>{
      mappaPiatti.set(dish.dish_id, dish.nome);
      mappaPiattiBloccati.set(dish.dish_id, dish.bloccato);
    })
  })
  .catch(error => {
    console.error(error);
  });


let lastMarkedAsCompleted = null; 

router.use((req, res, next)=>{
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
});

//homepage
router.get("/", (req, res)=>{
	res.status(200).render("homepage");
});


//statistiche

router.get("/stats", (req, res, next)=>{
  //colleziono tutte le statistiche, senza filtrare per nome
  connection
  .query('Select ingredients.name as ingrediente, Sum(items.quantity *components.quantity) as QuantitaTot from (orders INNER JOIN (items inner join components on items.dish_id = components.dish_id) ON orders.order_id = items.order_id) inner join ingredients on components.ingredient_id = ingredients.ingredient_id where orders.consegnato=false and orders.archiviato=false group by ingredients.name order by  ingredients.name')
  .then(data => {
    res.status(200).render("stats", {mappaIngredienti: mappaIngredienti, stats: data});
  })
  .catch(error => {
    console.error(error);
  });
})

//è stata selezionato un tipo di statistica
router.get("/stats/:ingredientID", (req, res, next)=>{
  let statId = parseInt(req.params.ingredientID);
  let statReq = mappaIngredienti.get(statId);

  if(statReq == null){
    res.status(503).send("<h1>ERROR 503</h1> <h2>La statistica richiesta non è attualmente disponibile</h2> <h3>Controllare la sintassi della richiesta</h3>");
    return;
  }

  connection
  .query(`Select ingredients.name as ingrediente, Sum(items.quantity *components.quantity) as QuantitaTot from (orders INNER JOIN (items inner join components on items.dish_id = components.dish_id) ON orders.order_id = items.order_id) inner join ingredients on components.ingredient_id = ingredients.ingredient_id where orders.consegnato=false and orders.archiviato=false and ingredients.ingredient_id = ${statId} group by ingredients.name order by  ingredients.name`)
  .then(data => {
    //stampa il risultato della query
    //console.log(data);
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
    .query(`SELECT order_id,nome,totale_effettivo,DataOrdine,asporto FROM orders WHERE orders.consegnato=false AND orders.archiviato=false ORDER BY order_id`) // AND orders.archiviato=false
    .then(data => {
      res.render("orders", {tipoVista: "todo", ordini: data});
    })
    .catch(error => {
      console.error(error);
    });
  }
  if(req.params.tipoVista == "done"){
    connection
    .query(`SELECT order_id,nome,totale_effettivo,DataOrdine,asporto FROM orders WHERE orders.consegnato=true AND orders.archiviato=false ORDER BY order_id`) // AND orders.archiviato=false
    .then(data => {
      res.render("orders", {tipoVista: "done", ordini: data});
    })
    .catch(error => {
      console.error(error);
    });
  }
})

router.get("/orders/completato/:order_id", (req, res, next)=>{ //sort by id TODO
  let id = parseInt(req.params.order_id);

  let dataConsegna = new Date();
  let tempoPerConsegna;

  dataConsegna = datetime.format(dataConsegna, 'YYYY MM DD - HH:mm:ss,SSS');

  lastMarkedAsCompleted = id;
  
  connection
  .execute(`UPDATE orders SET consegnato = true WHERE order_id = ${id}`)
  .catch(error => {
    console.error(error);
  });

  connection
  .execute(`UPDATE orders SET DataConsegna = '${dataConsegna}' WHERE order_id = ${id}`)
  .catch(error => {
    console.error(error);
  });

  //lascio il tempo al db di aggiornarsi
  setTimeout(function(){res.status(200).redirect("/orders/todo");}, 200); 
})

//richiesta di dettaglio ordine

router.get("/detail/:orderID", (req,res,next)=>{
  connection
  .query(`SELECT Items.nome, quantity, notes FROM orders, Items WHERE (orders.order_id=Items.order_id AND Items.order_id= ${req.params.orderID}  AND archiviato=false)`)
  .then(data=>{
    //console.log(data);
    res.send(data);
  })
  .catch(error => {
    console.error(error);
  });
})



//Ripristino ordini marcati come completati (consegnato=true nel DB)

router.get("/undoLastOrder", (req, res, next)=>{
  if(lastMarkedAsCompleted != null){
    let idToUndo = lastMarkedAsCompleted;
    lastMarkedAsCompleted = null;
    
    connection
    .execute(`UPDATE orders SET consegnato=false WHERE order_id = ${idToUndo}`)
    .catch(error=>{
      console.error(error);
    });
  }
  setTimeout(function(){res.status(200).redirect("/orders/todo");}, 200);
})

router.get("/orders/ripristina/:orderID", (req, res, next)=>{
  idRipristino = parseInt(req.params.orderID);
  connection
  .execute(`UPDATE orders SET consegnato=false WHERE order_id = ${idRipristino}`)
  .catch(error=>{
    console.error(error);
  });
  lastMarkedAsCompleted = null;
  setTimeout(function(){res.status(200).redirect("/orders/done");}, 200);
})


//locker

router.get("/locker", (req, res, next)=>{
  res.render("locker", { mappaPiatti: mappaPiatti, mappaPiattiBloccati: mappaPiattiBloccati })
})

router.get("/lock/:dish_id", (req, res)=>{
  let idOfDishToLock = parseInt(req.params.dish_id);
  //console.log(idOfDishToLock);
  connection
  .execute(`UPDATE Dishes SET bloccato=true WHERE dish_id = ${idOfDishToLock}`)
  .catch(error=>{
    console.error(error);
  });
  mappaPiattiBloccati.set(idOfDishToLock, true);
  setTimeout(()=>{res.status(200).redirect("/locker");}, 200);
});

router.get("/unlock/:dish_id", (req, res)=>{
  let idOfDishToUnlock = parseInt(req.params.dish_id);
  connection
  .execute(`UPDATE Dishes SET bloccato=false WHERE dish_id = ${idOfDishToUnlock}`)
  .catch(error=>{
    console.error(error);
  });
  mappaPiattiBloccati.set(idOfDishToUnlock, false);
  setTimeout(()=>{res.status(200).redirect("/locker");}, 200);
});

//404 page
router.use((req, res)=>{
    res.status(404).render("404");
});



module.exports = router;