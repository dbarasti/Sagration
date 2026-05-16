const fs = require('fs');
const path = require('path');

// Leggi il file di configurazione del menu
const menuConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'menu.json'), 'utf8')
);

// Crea la mappa delle aree
const areaToIngredients = new Map(
    Object.entries(menuConfig.aree)
);

module.exports = {
    menuConfig,
    areaToIngredients,
    // Funzione di utilità per verificare se un'area esiste
    isValidArea: (area) => areaToIngredients.has(area),
    // Funzione di utilità per ottenere gli ingredienti di un'area
    getIngredientsForArea: (area) => areaToIngredients.get(area) || []
}; 