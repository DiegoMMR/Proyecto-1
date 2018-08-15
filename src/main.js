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

		
		var mostrarCarrito = document.getElementById('ultimo_carrito');
		for (var i = 0; i < localStorage.length; i++) {
			var data = JSON.parse(localStorage.getItem(i));

			var producto = document.createElement('div');	

			var img = document.createElement('img');
			img.setAttribute('src', data.imagen);			
			img.setAttribute('width', '8%');			
			producto.appendChild(img);

			var texto = document.createElement('span');
			texto.innerHTML = data.name;
			producto.appendChild(texto);

			var input = document.createElement('input');
			input.setAttribute('type', 'number');
			input.setAttribute('value', data.quantity);
			producto.appendChild(input);

			var price = document.createElement('span');
			price.innerHTML = ' X ' + data.price;
			producto.appendChild(price);

			mostrarCarrito.appendChild(producto);
		}

	});
	$("#inicio").click(function(){
		$( "#ultimo_carrito" ).empty();
		$("#products_list").show();
		$("#products_cart").hide();

		$("#inicio").addClass("active");
		$("#carrito").removeClass("active");
	});


	$("#mostrarCarrito").click(function(){
		//alert('hola')
		$( "#ultimo_carrito" ).empty();
		var mostrarCarrito = document.getElementById('ultimo_carrito');
		for (var i = 0; i < localStorage.length; i++) {
			var data = JSON.parse(localStorage.getItem(i));

			var producto = document.createElement('div');	

			var img = document.createElement('img');
			img.setAttribute('src', data.imagen);			
			img.setAttribute('width', '8%');			
			producto.appendChild(img);

			var texto = document.createElement('span');
			texto.innerHTML = data.name;
			producto.appendChild(texto);

			var input = document.createElement('input');
			input.setAttribute('type', 'number');
			input.setAttribute('value', data.quantity);
			producto.appendChild(input);

			var price = document.createElement('span');
			price.innerHTML = ' X ' + data.price;
			producto.appendChild(price);

			mostrarCarrito.appendChild(producto);
		}

		
	});

});