QUERY PER REPERIRE LE QUANTITA DEGLI ORDINI ATTUALMENTE IN ELABORAZIONE

select righe_ingredienti.descrizione, count(*) from righe join ordini on righe.id_ordine = ordini.id join righe_ingredienti on righe.id = righe_ingredienti.id_riga_articolo where ordini.stato_cucina='ordinato' group by righe_ingredienti.descrizione;
