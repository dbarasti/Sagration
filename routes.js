let express = require("express");
let datetime = require('date-and-time');
const { stat } = require("forever");
let router = express.Router();
let client = require('./db.js').client

let idToIngredient = new Map();
const queryString = `select righe_ingredienti.descrizione, Sum(righe_ingredienti.quantita) as quantita from righe join ordini on righe.id_ordine = ordini.id join righe_ingredienti on righe.id = righe_ingredienti.id_riga_articolo where ordini.stato_cucina='ordinato' group by righe_ingredienti.descrizione`


//per ogni id ingrediente associo la stringa rappresentante il nome dell'ingrediente
client.query(`SELECT id, descrizione FROM ingredienti`, (err, ingredients) => {
  if (err){
    console.log(err)
  }
  ingredients.rows.forEach((ingredient)=>{
    idToIngredient.set(ingredient.id, ingredient.descrizione);
  })
})

const areaToIngredients = new Map([['primi', ['Bigoli Pomodoro', "Bigoli Ragu'", 'Bigoli Anatra', 'Gnocchi Pomodoro', "Gnocchi al Ragu'", 'Gnocchi Anatra']],['secondi', ['1/4 Pollo' ,'1/2 pollo', 'Costicina', 'Salsiccia', 'Bistecca Cavallo', 'Fetta Polenta', 'GranFritto misto', 'Gamberone', 'Frittura Sardine', 'Fritto Anelli',  ]],['contorni', ['Pt Misto Verdure', 'Porz.Pomodoro', 'Porz.Patatine']]])



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

router.get("/distinta", (req, res)=>{
  client
  .query(queryString)
  .then(data => {
    res.status(200).render("distinta", {stats: data.rows});
  })
  .catch(error => {
    console.error(error);
  });
});


router.get("/distinta/:area", (req, res)=>{
  area = req.params.area
  if(!areaToIngredients.has(area)){
    res.status(503).send("<h1>ERROR 503</h1>");
    return
  }
  client.query(queryString)
  .then(distinte=>{
    // res.send(distinte.rows.filter(distinta => areaToIngredients.get(area).indexOf(distinta.descrizione) != -1))
    res.render("distinta", {stats: distinte.rows.filter(distinta => areaToIngredients.get(area).indexOf(distinta.descrizione) != -1)}) 
  })
  .catch(err=>{
    console.error(err);
  })
});



//404 page
router.use((req, res)=>{
    res.status(404).render("404");
});

module.exports = router;