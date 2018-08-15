var db

$(document).ready(function(){
	//crea la tabla
	db = openDatabase('ShoopingStoreDb', '1.0', 'Shopping Store Database', 5 * 1024 * 1024);

	db.transaction(function (tx) {
        var itemsSql = "CREATE TABLE IF NOT EXISTS items (" +
            "item_id			INTEGER         PRIMARY KEY," +
            "item_name			VARCHAR(140)	NOT NULL," +
            "item_description	VARCHAR(255)	NOT NULL," +
            "list_price			DECIMAL(5,2)	NOT NULL );";

        var cartSql = "CREATE TABLE IF NOT EXISTS cart (" +
            "item_id           INTEGER      NOT NULL     ," +
            "quantity          INTEGER      NOT NULL," +
            "FOREIGN KEY (item_id) REFERENCES items (item_id) );";


        tx.executeSql(itemsSql, [], null, errorHandler);
		tx.executeSql(cartSql, [], null, errorHandler);
	}, errorHandler);

	let sqlString = "DELETE FROM cart ;";

	db.transaction(function (tx) {
		tx.executeSql(sqlString, [], null, errorHandler);
	});

	db.transaction(function (tx) {

        tx.executeSql("SELECT * FROM items WHERE item_name = ?", ['Accesorio Canino'],
            function (tx, res) {
                if (res.rows.length === 0) {
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Sueter', '100% algodon, S M  L XL', 50.5)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Accesorio Canino', 'Collar 100%poliester para razas pequeñas', 25.0)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Sueter Pero', 'Sueter 100% poliester para razas peque;as', 30.0)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Playera', '100% algodon, S M  L XL', 25.0)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Sudadera', '100% algodon, S M  L XL', 45.5)");
                }
                else {
                }
            });
    });

	//hide or show elements cuando se cambia de tab
	$("#carrito").click(function(){
		$("#products_list").hide();
		$("#products_cart").show();

		$("#carrito").addClass("active");
		$("#inicio").removeClass("active");

		
		for (var i = 0; i < localStorage.length; i++) {

			let data = JSON.parse(localStorage.getItem(i));
			let sqlString = "INSERT INTO cart (item_id, quantity) VALUES (?, ?)";

			db.transaction(function (tx) {
				tx.executeSql(sqlString, [data.id, data.quantity],
				function (tx, res) {
					getCart();
				}, errorHandler);
			});
			/*
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

			mostrarCarrito.appendChild(producto);*/
		}

	});
	$("#inicio").click(function(){

		let sqlString = "DELETE FROM cart ;";

		db.transaction(function (tx) {
			tx.executeSql(sqlString, [], null, errorHandler);
		});

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

			var sqlString = "INSERT INTO cart (item_id, quantity) VALUES (?, ?)";

			db.transaction(function (tx) {
				tx.executeSql(sqlString, [data.id, data.quantity],
				function (tx, res) {
					getCart();
				}, errorHandler);
			});
		}

		
	});

});

function getCart() {
    db.transaction(function (tx) {

        tx.executeSql("SELECT * FROM cart INNER JOIN items ON cart.item_id = items.item_id", null,
		function (tx, res) {

		    var code = "";
		    var quantity = 0;

		    var subtotal = 0;
		    var tax = 0;
		    var total = 0;

		    if (res.rows.length == 0) {
		        code = code + '<span class="text-muted">El Carrito esta vacio.</span>';
		        $('#checkout').attr("disabled", true);
		    }
		    else {
		        var len = res.rows.length;

		        for (var i = 0; i < len; i++) {
                    
		            code = code +
                    '<div class="row">' +
                        '<div class="col-2 col-md-2 col-lg-2 col-xl-2">' +
                            '<img class="img-fluid" src="assets/img/' + res.rows.item(i).item_id + '.jpg">' +
                        '</div>' +
                        '<div class="col-5 col-md-6 col-lg-7 col-xl-7">' +
                            '<h4 class="product-name">' + res.rows.item(i).item_name + '</h4>' +
                            '<p>' + res.rows.item(i).item_description + '</p>' +
                        '</div>' +
                        '<div class="col-5 col-md-4 col-lg-3 col-xl-3 text-center">' +

                            '<h4>' +
                                '<strong>Q' + res.rows.item(i).list_price.toFixed(2) + ' </strong><span class="text-muted">x</span> ' +
                            '</h4>' +
                            '<p>' +
                                '<div class="input-group">' +
                                    '<span class="input-group-btn">' +
                                        '<button class="btn btn-default" onclick="javascript:changeQuantity(' + res.rows.item(i).item_id + ', ' + res.rows.item(i).quantity + ', -1);" type="button">–</button>' +
                                    '</span>' +
                                    '<input type="text" id="quantity' + res.rows.item(i).item_id + '" disabled class="form-control input text-center" value="' + res.rows.item(i).quantity + '">' +
                                    '<span class="input-group-btn">' +
                                        '<button class="btn btn-default" onclick="javascript:changeQuantity(' + res.rows.item(i).item_id + ', ' + res.rows.item(i).quantity + ', 1)" type="button">+</button>' +
                                    '</span>' +
                                '</div>' +
                            '</p>' +

                            '<p><form action="javascript:removeFromCart(' + res.rows.item(i).item_id + ');" class="form-inline">' +
                                '<button type="submit" class="btn btn-danger nav-justified">Remover</button>' +
                            '</form></p>' +
                        '</div>' +
                    '</div>' +
                    '<hr>';

		            quantity = quantity + res.rows.item(i).quantity;
		            subtotal = subtotal + (res.rows.item(i).list_price * res.rows.item(i).quantity);
		        }

		        $('#checkout').attr("disabled", false);
		    }

		    tax = subtotal * 0.12; //colocar calculo del impuesto iva//
		    total = subtotal + tax;

		    $("#ultimo_carrito").empty();
		    $("#ultimo_carrito").append(code);

		    $("#subtotal").html("Q" + subtotal.toFixed(2));
		    $("#tax").html("Q" + tax.toFixed(2));
		    $("#total").html("Q" +total.toFixed(2));
		});        
    });
}

function removeFromCart(item_id) {
	var sqlString = "DELETE FROM cart WHERE item_id = " + item_id + ";";

    db.transaction(function (transaction) {
        transaction.executeSql(
                sqlString,
                [],
                function (transaction, response) {
                    getCart();
                },
                errorHandler
            );
    });
}

function changeQuantity(item_id, currQuantity, changeBy) {
    if (!(currQuantity == 1 && changeBy == -1))
    {
		
        let newQuantity = currQuantity + changeBy;
        let sqlString = "UPDATE cart SET quantity = '" + newQuantity
            + "' WHERE item_id = " + item_id + ";"; 
			console.log(sqlString)
		db.transaction(function (tx) {
				tx.executeSql(
						sqlString,
						[],
						function (tx, res) {
							getCart();
						},
						errorHandler
					);
		});
    }
}