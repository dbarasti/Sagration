function getDetail(orderID) {
	var xhttp = new XMLHttpRequest(); 
	xhttp.onreadystatechange = function() {
  		if (this.readyState == 4 && this.status == 200) {
  			document.getElementById("detailBox_"+orderID).style.height = 'auto';
  			document.getElementById("exit_"+orderID).style.display = 'inline';
  			document.getElementById("detailBox_"+orderID).style.border = '1px solid black';
  			var detail = JSON.parse(this.responseText);
  			var detailElement = document.getElementById("detail_"+orderID);
  			
  			detailElement.innerHTML = `<p>  ${detail[0].quantity}X  ${detail[0].nome} -- ${detail[0].notes.toUpperCase()}  </p>`
  			delete detail[0];
  			detail.forEach( (element)=>{
  				detailElement.insertAdjacentHTML('beforeend', `<p>  ${element.quantity}X  ${element.nome} -- ${element.notes.toUpperCase()}  </p>`);
  			});

        //document.getElementById("detail_"+orderID).innerHTML = JSON.parse(this.responseText) + this.responseText;
 		}
	};

	xhttp.open("GET", "/detail/"+orderID, true);
	xhttp.send();
}

function exitDetail(orderID){
	document.getElementById("detailBox_"+orderID).style.height = '0px';
  document.getElementById("exit_"+orderID).style.display = 'none';
  document.getElementById("detailBox_"+orderID).style.border = 'none';
  document.getElementById("detail_"+orderID).innerHTML = '';
}