function getDetail(orderID) {
	var xhttp = new XMLHttpRequest(); 
	xhttp.onreadystatechange = function() {
  		if (this.readyState == 4 && this.status == 200) {
  			document.getElementById("detail_"+orderID).style.height = 'auto';
  			document.getElementById("exit_"+orderID).style.display = 'inline';
  			document.getElementById("detail_"+orderID).style.border = '1px solid black';
    		document.getElementById("detail_"+orderID).innerHTML = this.responseText;
 		}
	};

	xhttp.open("GET", "/detail/"+orderID, true);
	xhttp.send();
}

function exitDetail(orderID){
	document.getElementById("detail_"+orderID).style.height = '0px';
  document.getElementById("exit_"+orderID).style.display = 'none';
  document.getElementById("detail_"+orderID).style.border = 'none';
  document.getElementById("detail_"+orderID).innerHTML = '';
}