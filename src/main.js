/*
var myDBInstance = openDatabase('dbSibeeshPassion', '1.0', 'This is a client side database', 2 * 1024 * 1024);

if (!myDBInstance) {
  	alert('Oops, your database was not created');
}
else {
	var version = myDBInstance.version;

	myDBInstance.transaction(function (tran) {
		tran.executeSql('CREATE TABLE IF NOT EXISTS pedidos (producto, precio, cantidad, subtotal)');
	});
}
*/

$(document).ready(function(){
	//crea la tabla
	var myDBInstance = openDatabase('dbSibeeshPassion', '1.0', 'This is a client side database', 2 * 1024 * 1024);

	if (!myDBInstance) {
		alert('Oops, your database was not created');
	}
	else {
		var version = myDBInstance.version;

		myDBInstance.transaction(function (tran) {
			tran.executeSql('CREATE TABLE IF NOT EXISTS pedidos (producto, precio, cantidad, subtotal)');
		});
	}



	//hide or show elements cuando se cambia de tab
	$("#carrito").click(function(){
		$("#products_list").hide();
		$("#products_cart").show();

		$("#carrito").addClass("active");
		$("#inicio").removeClass("active");
	});
	$("#inicio").click(function(){
		$("#products_list").show();
		$("#products_cart").hide();

		$("#inicio").addClass("active");
		$("#carrito").removeClass("active");
	});

});