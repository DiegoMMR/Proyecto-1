    function addEvent(element, event, delegate ) {
        if (typeof (window.event) != 'undefined' && element.attachEvent)
            element.attachEvent('on' + event, delegate);
        else 
            element.addEventListener(event, delegate, false);
    }

    addEvent(document, 'readystatechange', function() {
        if ( document.readyState !== "complete" ) 
            return true;
            
        var items = document.querySelectorAll("section.products ul li");
        var cart = document.querySelectorAll("#cart ul")[0];
        var shopCart = document.querySelectorAll("#shopCart")[0];
        
        function updateCart(){
            //borra toda la data para evitar que se quede en otra sesion
            //localStorage.clear();

            var total = 0.0;
            var cart_items = document.querySelectorAll("#cart ul li")
            for (var i = 0; i < cart_items.length; i++) {
                var cart_item = cart_items[i];
                var quantity = cart_item.getAttribute('data-quantity');
                var name = cart_item.getAttribute('data-name');
                var price = cart_item.getAttribute('data-price');
                var imagen = cart_item.getAttribute('imagen');

                //guarda los datos locales para poder usarlos despues
                producto = {
                    name: name,
                    price: price,
                    quantity: quantity,
                    imagen: imagen
                };
                localStorage.setItem(i, JSON.stringify(producto));
                
                var sub_total = parseFloat(quantity * parseFloat(price));
                cart_item.querySelectorAll("span.sub-total")[0].innerHTML = " = " + sub_total.toFixed(2);
                
                total += sub_total;
            }

            //parsea la data para obtener un objeto y poder 
            //var data = JSON.parse(localStorage.getItem(i));
            
            document.querySelectorAll("#cart span.total")[0].innerHTML = total.toFixed(2);
        }
        
        function addCartItem(item, id) {
            localStorage.clear();
            var clone = item.cloneNode(true);
            clone.setAttribute('data-id', id);
            clone.setAttribute('data-quantity', 1);
            clone.removeAttribute('id');
            
            var fragment = document.createElement('span');
            fragment.setAttribute('class', 'quantity');
            fragment.innerHTML = ' x 1';
            clone.appendChild(fragment);	
            
            fragment = document.createElement('span');
            fragment.setAttribute('class', 'sub-total');
            clone.appendChild(fragment);					
            cart.appendChild(clone);
        }
        
        function updateCartItem(item){
            var quantity = item.getAttribute('data-quantity');
            quantity = parseInt(quantity) + 1
            item.setAttribute('data-quantity', quantity);
            var span = item.querySelectorAll('span.quantity');
            span[0].innerHTML = ' x ' + quantity;
        }
        
        //cuando el producto car en el carrito 
        function onDrop(event){			
            if(event.preventDefault) event.preventDefault();
            if (event.stopPropagation) event.stopPropagation();
            else event.cancelBubble = true;
            
            var id = event.dataTransfer.getData("Text");
            var item = document.getElementById(id);			
            //agrega un elemnto li con el nombre , la cantidad y el precio del producto           
            var exists = document.querySelectorAll("#cart ul li[data-id='" + id + "']");
            
            if(exists.length > 0){
                updateCartItem(exists[0]);
            } else {
                addCartItem(item, id);
            }
            
            updateCart();
            
            return false;
        }
        
        //cuando el producto pasa por arriba del carrito
        function onDragOver(event){
            if(event.preventDefault) event.preventDefault();
            if (event.stopPropagation) event.stopPropagation();
            else event.cancelBubble = true;
            return false;
        }

        addEvent(shopCart, 'drop', onDrop);
        addEvent(shopCart, 'dragover', onDragOver);
        
        function onDrag(event){
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.dropEffect = "move";
            var target = event.target || event.srcElement;
            var success = event.dataTransfer.setData('Text', target.id);
        }
            
        
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.setAttribute("draggable", "true");
            addEvent(item, 'dragstart', onDrag);
        };
    });