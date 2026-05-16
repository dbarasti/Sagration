let express = require("express");
let datetime = require('date-and-time');
const { stat } = require("forever");
let router = express.Router();
let client = require('./db.js').client
const { areaToIngredients, isValidArea, getIngredientsForArea } = require('./config/menuConfig');
const menuConfig = require('./config/menuConfig').menuConfig;

let idToIngredient = new Map();
const queryString = `select righe_ingredienti.descrizione, Sum(righe_ingredienti.quantita) as quantita from righe join ordini on righe.id_ordine = ordini.id join righe_ingredienti on righe.id = righe_ingredienti.id_riga_articolo where ordini.stato_cucina='ordinato' group by righe_ingredienti.descrizione order by righe_ingredienti.descrizione`

//per ogni id ingrediente associo la stringa rappresentante il nome dell'ingrediente
client.query(`SELECT id, descrizione FROM ingredienti`, (err, ingredients) => {
  if (err){
    console.log(err)
  }
  ingredients.rows.forEach((ingredient)=>{
    idToIngredient.set(ingredient.id, ingredient.descrizione);
  })
})

// const areaToIngredients = new Map([['primi', ['Bigoli', "Gnocchi", 'Bigoli all\'Anatra', 'Gnocchi al Pomodoro', "Gnocchi al Ragù'", 'Gnocchi all\'Anatra']],['secondi', ['1/4 Pollo' ,'1/2 pollo', 'Costicina', 'Salsiccia', 'Bistecca Cavallo', 'Fetta Polenta', 'GranFritto misto', "Baccala' Vic.+Polenta", 'Gamberone', 'Frittura Sardine', 'Fritto Anelli',  ]],['contorni', ['Porz.Fagioli', 'Pt Misto Verdure', 'Porz.Pomodoro', 'Porz.Patatine']]])
// const areaToIngredients = new Map([['primi', ['Gnocchi al Pomodoro']],['secondi', ['Piatto festa']],['contorni', ['Porz.Fagioli']]])



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
    res.status(200).render("distinta", {
      stats: data.rows,
      menuConfig: menuConfig
    });
  })
  .catch(error => {
    console.error(error);
  });
});


router.get("/distinta/:area", (req, res)=>{
  const area = req.params.area;
  if(!isValidArea(area)){
    res.status(503).send("<h1>ERROR 503</h1>");
    return;
  }
  
  client.query(queryString)
  .then(distinte=>{
    // Debug logging
    console.log('Area selezionata:', area);
    console.log('Ingredienti disponibili per l\'area:', getIngredientsForArea(area));
    console.log('Distinte ricevute dal DB:', distinte.rows.map(d => d.descrizione));
    
    const filteredStats = distinte.rows.filter(distinta => {
      const isIncluded = getIngredientsForArea(area).includes(distinta.descrizione);
      if (!isIncluded) {
        console.log(`Ingrediente non trovato: "${distinta.descrizione}"`);
      }
      return isIncluded;
    });

    console.log('Statistiche filtrate:', filteredStats.map(s => s.descrizione));
    
    res.render("distinta", {
      stats: filteredStats,
      menuConfig: menuConfig
    }); 
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