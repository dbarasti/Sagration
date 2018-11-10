function clearAll(totalePanino) {
   document.getElementById("prezzo").innerHTML = "0 EURO";
   document.getElementById("double").checked = false;
   document.getElementById("carne1").checked = false;
   document.getElementById("carne2").checked = false;
   document.getElementById("verdura1").checked = false;
   document.getElementById("verdura2").checked = false;
   document.getElementById("verdura3").checked = false;
   document.getElementById("verdura4").checked = false;
   document.getElementById("verdura5").checked = false;
   document.getElementById("verdura6").checked = false;
   document.getElementById("verdura7").checked = false;
   document.getElementById("salsa1").checked = false;  
   document.getElementById("salsa2").checked = false;  
   document.getElementById("salsa3").checked = false;  
   document.getElementById("salsa4").checked = false;         
}
function setTotale(prezzo) {
   var current = parseFloat(document.getElementById('totale').innerHTML);
   current += prezzo;
   document.getElementById('totale').innerHTML = current.toString() + ' EURO';
}


function cannavacciuoloClicked() {
   if(document.getElementById("cannavacciuolo").checked == true)
      cannavacciuoloChecked();
   else
      cannavacciuoloUnchecked();
}
function cannavacciuoloChecked(){
   document.getElementById('totale').innerHTML = (parseFloat(document.getElementById('totale').innerHTML) + 7).toString() + ' EURO'
   document.getElementById("prezzo").innerHTML = "7 EURO";
   //aggiorno input fittizio
   document.getElementById("totalePanino").value = "7";
   document.getElementById("carne1").checked = true;
   document.getElementById("verdura1").checked = true;
   document.getElementById("verdura5").checked = true;
   document.getElementById("verdura3").checked = true;
   document.getElementById("verdura2").checked = true;
   document.getElementById("salsa4").checked = true;
}

function cannavacciuoloUnchecked(){
   setTotale(0-7);
   clearAll(parseFloat(document.getElementById("prezzo").innerHTML));
   document.getElementById("totalePanino").value = "0";
}

function borgheseClicked() {
   if(document.getElementById("borghese").checked == true)
      borgheseChecked();
   else
      borgheseUnchecked();
}
function borgheseChecked(){
   setTotale(7);
   document.getElementById("prezzo").innerHTML = "7 EURO";
   document.getElementById("totalePanino").value = "7";
   document.getElementById("carne2").checked = true;
   document.getElementById("verdura1").checked = true;
   document.getElementById("verdura3").checked = true;
   document.getElementById("verdura4").checked = true;
   document.getElementById("salsa3").checked = true;
}

function borgheseUnchecked(){
   setTotale(0-7);
   clearAll(parseFloat(document.getElementById("prezzo").innerHTML));
   document.getElementById("totalePanino").value = "0";
}

function ramseyClicked() {
   if(document.getElementById("ramsey").checked == true)
      ramseyChecked();
   else
      ramseyUnchecked();
}
function ramseyChecked(){
   setTotale(9);
   document.getElementById("prezzo").innerHTML = "9 EURO";
   document.getElementById("totalePanino").value = "9";
   document.getElementById("carne2").checked = true;
   document.getElementById("double").checked = true;
   document.getElementById("verdura1").checked = true;
   document.getElementById("verdura5").checked = true;
   document.getElementById("verdura6").checked = true;
   document.getElementById("verdura7").checked = true;
   document.getElementById("salsa3").checked = true;
   document.getElementById("salsa3").checked = true;
}

function ramseyUnchecked(){
   setTotale(0-9);
   clearAll(parseFloat(document.getElementById("prezzo").innerHTML));
   document.getElementById("totalePanino").value = "0";
}

function babyClicked() {
   if(document.getElementById("baby").checked == true)
      babyChecked();
   else
      babyUnchecked();
}
function babyChecked() {
   setTotale(4-parseFloat(document.getElementById("prezzo").innerHTML));
   document.getElementById("totalePanino").value = "4";
   document.getElementById("prezzo").innerHTML = "4 EURO";
   document.getElementById("carne2").checked = true;
}
function babyUnchecked() {
   setTotale(0-4);
   document.getElementById("totalePanino").value = "0";
   clearAll();
}

function doubleClicked() {
   if(document.getElementById("double").checked == true){
      if(document.getElementById("carne1").checked == false && document.getElementById("carne2").checked == false){
         document.getElementById("double").checked = false;
      }
      else{
         setTotale(9-parseFloat(document.getElementById("prezzo").innerHTML));
         document.getElementById("prezzo").innerHTML = "9 EURO";
         document.getElementById("totalePanino").value = "9";
      }

   }
   else{
      setTotale(7 - parseFloat(document.getElementById("prezzo").innerHTML));
      document.getElementById("prezzo").innerHTML = "7 EURO";
      document.getElementById("totalePanino").value = "7";
   }
}

function carneClicked() {
   if(document.getElementById("baby").checked == true)
      return;
   if(document.getElementById("double").checked == true){
      setTotale(9-parseFloat(document.getElementById("prezzo").innerHTML));
      document.getElementById("prezzo").innerHTML = "9 EURO";
      document.getElementById("totalePanino").value = "9";
   }
   else{
      setTotale(7-parseFloat(document.getElementById("prezzo").innerHTML));
      document.getElementById("prezzo").innerHTML = "7 EURO";
      document.getElementById("totalePanino").value = "7";
   }
}

function farcituraClicked(){
   if(document.getElementById("carne1").checked == false && document.getElementById("carne2").checked == false)
      if(parseFloat(document.getElementById("prezzo").innerHTML) == 5)
         return
      else{
         setTotale(5-parseFloat(document.getElementById("prezzo").innerHTML));
         document.getElementById("prezzo").innerHTML = "5 EURO";
         document.getElementById("totalePanino").value = "5";
      }
   else{
      if(document.getElementById("baby").checked == true){
         setTotale(7-parseFloat(document.getElementById("prezzo").innerHTML));
         document.getElementById("baby").checked = false;
         document.getElementById("prezzo").innerHTML = "7 EURO";
         document.getElementById("totalePanino").value = "7";
      }
   }
      
}





function bevandaClicked(bevanda, prezzo) {
                  
   if(document.getElementById(bevanda).checked == 1){
      //aggiornamento totale bevande
      var value = parseFloat(document.getElementById('prezzoBevande').innerHTML);
      value = value + prezzo;
      document.getElementById('prezzoBevande').innerHTML = value.toString() + ' EURO';
      document.getElementById('totaleBevande').value = value;
      //aggiornamento conto totale
      setTotale(prezzo);

      //aggiornamento drop menu
      document.getElementById("dropdown"+bevanda.charAt(bevanda.length-1)).innerHTML = 1; //setto il testo del dropdown menù
         //disabilito l'item 
      //document.getElementById("it1").classList.add('disabled');
      document.getElementById(bevanda+"1").classList.toggle('disabled'); //bevanda+"1" indica il primo elemento del dropdown della bevanda
      
      //metto in coda a bevanda la quantità selezionata (O ALMENO CI PROVO)
      document.getElementById(bevanda).value = 1;  


   }
   else{
      //calcolo valore da sottrarre
      quantita = parseInt(document.getElementById("dropdown"+bevanda.charAt(bevanda.length-1)).innerHTML);

      //aggiornamento totale bevande
      var value = parseFloat(document.getElementById('prezzoBevande').innerHTML);
      value = value - prezzo*quantita;
      document.getElementById('prezzoBevande').innerHTML = value.toString() + ' EURO';
      
      //aggiorno input fittizio
      document.getElementById('totaleBevande').value = value;

      //aggiornamento totale
      setTotale(0-prezzo*quantita);

      
      //riabilito la entry
      var dropdown = "dropdown" + bevanda.charAt(bevanda.length-1); 
      document.getElementById(bevanda+document.getElementById(dropdown).innerHTML).classList.toggle('disabled');
      
      //aggiorno drop menu
      document.getElementById('dropdown'+bevanda.charAt( bevanda.length-1)).innerHTML = 0;


   }
         
}


function dropClicked(dropdown, bevanda, prezzo) {
 
   quantita = bevanda.charAt(dropdown.length-1) //ultimo carattere di bevanda
  
   if(document.getElementById("bevanda"+bevanda.charAt(dropdown.length-2)).checked == true){
      var quantita_old = parseInt(document.getElementById(dropdown).innerHTML);
      var dropNum = dropdown.charAt(dropdown.length-1);
      //disabilito entry selezionata
      document.getElementById(bevanda).classList.toggle('disabled');
      //riabilito la entry selezionata precedentemente
      document.getElementById("bevanda"+dropNum+quantita_old.toString()).classList.toggle('disabled');
      //aggiorno testo del dropdown menu
      document.getElementById(dropdown).innerHTML = quantita;
      
      //ORA AGGIORNO I CONTI

      valore_old = quantita_old*prezzo;
      diff = quantita*prezzo - valore_old;
      setTotale(diff);

      var value = parseFloat(document.getElementById('prezzoBevande').innerHTML);
      value = value + diff;
      document.getElementById('prezzoBevande').innerHTML = value.toString() + ' EURO';
   
         //aggiorno input fittizzio
      document.getElementById('totaleBevande').value = value;

      //metto in coda a bevanda la quantità selezionata (O ALMENO CI PROVO)
      document.getElementById(bevanda.slice(0,-1)).value = quantita;    
   }
   else{
      document.getElementById("bevanda"+bevanda.charAt(dropdown.length-2)).checked = true;
      document.getElementById(dropdown).innerHTML = quantita;
      //disabilito la entry selezionata
      document.getElementById(bevanda).classList.toggle('disabled');

      //ORA AGGIORNO I CONTI
         //aggiorno totale ordine
      setTotale(prezzo*quantita);
         //aggiorno conto bevande
      var value = parseFloat(document.getElementById('prezzoBevande').innerHTML);
      value = value + prezzo*quantita;
      document.getElementById('prezzoBevande').innerHTML = value.toString() + ' EURO';

         //aggiorno input fittizzio
      document.getElementById('totaleBevande').value = value;

      //metto nel valore di 'bevanda' la quantità selezionata (O ALMENO CI PROVO)
      document.getElementById(bevanda.slice(0,-1)).value = quantita;  
   }
}