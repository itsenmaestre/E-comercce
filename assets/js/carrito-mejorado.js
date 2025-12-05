// ========================================
// CARRITO DE COMPRAS MEJORADO - PRODART
// ========================================

document.addEventListener('DOMContentLoaded', () => { 
    
    // ========== BASE DE DATOS DE PRODUCTOS ==========
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Sombrero Vueltiao Tradicional Bandera de Colombia 23 vueltas',
            precio: 250000,
            precioOriginal: 320000,
            imagen: 'assets/img/feature_prod_01.jpg',
            categoria: 'sombreros',
            rating: 5,
            descuento: 22
        },
        {
            id: 2,
            nombre: 'Sombrero Vueltiao Machiembriao Premium',
            precio: 150000,
            precioOriginal: 180000,
            imagen: 'assets/img/sombrero4.jpg',
            categoria: 'sombreros',
            rating: 4,
            descuento: 17
        },
        {
            id: 3,
            nombre: 'Sombrero Vueltiao Colombiano 15 Vueltas Tricolor',
            precio: 250000,
            precioOriginal: 300000,
            imagen: 'assets/img/feature_prod_02.jpg',
            categoria: 'sombreros',
            rating: 5,
            descuento: 17
        },
        {
            id: 4,
            nombre: 'Mochila Wayuu Azul Artesanal Grande',
            precio: 120000,
            precioOriginal: 150000,
            imagen: 'assets/img/shop_04.jpg',
            categoria: 'mochilas',
            rating: 5,
            descuento: 20
        },
        {
            id: 5,
            nombre: 'Bolso en Fique Natural Hecho a Mano',
            precio: 120000,
            precioOriginal: 140000,
            imagen: 'assets/img/shop_03.jpg',
            categoria: 'bolsos',
            rating: 4,
            descuento: 14
        },
        {
            id: 6,
            nombre: 'Hamaca Tradicional Colombiana Doble',
            precio: 180000,
            precioOriginal: 220000,
            imagen: 'assets/img/category_img_02.jpg',
            categoria: 'hamacas',
            rating: 5,
            descuento: 18
        }
    ];

    // ========== VARIABLES GLOBALES ==========
    let carrito = [];
    const divisa = ' COP';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMsubtotal = document.querySelector('#subtotal');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMcartCount = document.querySelector('#cart-count');
    const DOMcarritoValue = document.querySelector('#carrito-value');
    const DOMcartEmpty = document.querySelector('#cart-empty');
    const DOMcartSummary = document.querySelector('#cart-summary');
    const DOMcartActions = document.querySelector('#cart-actions');
    const DOMproductosCount = document.querySelector('#productos-count');
    const miLocalStorage = window.localStorage;
    const filtroSelect = document.getElementById("filtro");

    // ========== FUNCIONES DE FORMATO ==========
    
    /**
     * Formatea un número como precio en COP
     */
    function formatearPrecio(precio) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(precio);
    }

    /**
     * Genera estrellas de rating
     */
    function generarEstrellas(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                html += '<i class="fas fa-star"></i>';
            } else {
                html += '<i class="far fa-star"></i>';
            }
        }
        return html;
    }

    // ========== RENDERIZAR PRODUCTOS ==========
    
    function renderizarProductos() {
        DOMitems.innerHTML = "";
        const filtro = filtroSelect.value;
        const productosFiltrados = baseDeDatos.filter(producto => 
            filtro === "todas" || producto.categoria === filtro
        );

        // Actualizar contador de productos
        DOMproductosCount.textContent = productosFiltrados.length;

        productosFiltrados.forEach((producto) => {
            // Crear card de producto
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-product-id', producto.id);
            
            card.innerHTML = `
                ${producto.descuento ? `<div class="badge-discount">-${producto.descuento}%</div>` : ''}
                
                <div class="image-container">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="quick-actions">
                        <button class="btn-quick" title="Vista rápida">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-quick" title="Agregar a favoritos">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
                
                <div class="card-body">
                    <div class="product-category">${producto.categoria}</div>
                    <h5 class="product-title">${producto.nombre}</h5>
                    
                    <div class="product-rating">
                        ${generarEstrellas(producto.rating)}
                        <span>(${producto.rating}.0)</span>
                    </div>
                    
                    <div class="product-price">
                        <div>
                            <span class="price-current">${formatearPrecio(producto.precio)}</span>
                            ${producto.precioOriginal ? `<span class="price-original">${formatearPrecio(producto.precioOriginal)}</span>` : ''}
                        </div>
                    </div>
                    
                    <button class="btn-add-cart" data-id="${producto.id}">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al Carrito
                    </button>
                </div>
            `;
            
            // Agregar event listener al botón
            const btnAgregar = card.querySelector('.btn-add-cart');
            btnAgregar.addEventListener('click', () => anadirProductoAlCarrito(producto.id, card));
            
            DOMitems.appendChild(card);
        });
    }

    // ========== AGREGAR PRODUCTO AL CARRITO ==========
    
    function anadirProductoAlCarrito(productoId, cardElement) {
        // Agregar al carrito
        carrito.push(productoId.toString());
        
        // Animación de la card
        cardElement.classList.add('adding');
        setTimeout(() => {
            cardElement.classList.remove('adding');
        }, 600);
        
        // Actualizar UI
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        actualizarContadores();
        mostrarToast('¡Producto agregado!', 'El producto se añadió exitosamente a tu carrito');
    }

    // ========== RENDERIZAR CARRITO ==========
    
    function renderizarCarrito() {
        DOMcarrito.innerHTML = '';
        
        // Si el carrito está vacío
        if (carrito.length === 0) {
            DOMcartEmpty.style.display = 'block';
            DOMcarrito.style.display = 'none';
            DOMcartSummary.style.display = 'none';
            DOMcartActions.style.display = 'none';
            return;
        }
        
        // Mostrar elementos del carrito
        DOMcartEmpty.style.display = 'none';
        DOMcarrito.style.display = 'block';
        DOMcartSummary.style.display = 'block';
        DOMcartActions.style.display = 'flex';
        
        // Obtener productos únicos
        const carritoSinDuplicados = [...new Set(carrito)];
        
        carritoSinDuplicados.forEach((itemId) => {
            const producto = baseDeDatos.find(p => p.id === parseInt(itemId));
            if (!producto) return;
            
            const cantidad = carrito.filter(id => id === itemId).length;
            const subtotalItem = producto.precio * cantidad;
            
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${producto.nombre}</div>
                    <div class="cart-item-price">${formatearPrecio(producto.precio)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn btn-decrease" data-id="${itemId}">-</button>
                        <span class="quantity-value">${cantidad}</span>
                        <button class="quantity-btn btn-increase" data-id="${itemId}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${itemId}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Event listeners para botones de cantidad
            li.querySelector('.btn-decrease').addEventListener('click', () => disminuirCantidad(itemId));
            li.querySelector('.btn-increase').addEventListener('click', () => aumentarCantidad(itemId));
            li.querySelector('.cart-item-remove').addEventListener('click', () => eliminarProducto(itemId));
            
            DOMcarrito.appendChild(li);
        });
        
        // Actualizar totales
        actualizarTotales();
    }

    // ========== GESTIÓN DE CANTIDADES ==========
    
    function aumentarCantidad(productoId) {
        carrito.push(productoId);
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        actualizarContadores();
    }
    
    function disminuirCantidad(productoId) {
        const index = carrito.indexOf(productoId);
        if (index > -1) {
            carrito.splice(index, 1);
            renderizarCarrito();
            guardarCarritoEnLocalStorage();
            actualizarContadores();
            
            if (carrito.length === 0) {
                mostrarToast('Carrito vacío', 'Tu carrito está vacío', 'info');
            }
        }
    }
    
    function eliminarProducto(productoId) {
        carrito = carrito.filter(id => id !== productoId);
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        actualizarContadores();
        mostrarToast('Producto eliminado', 'El producto se eliminó del carrito', 'warning');
    }

    // ========== CALCULAR TOTALES ==========
    
    function calcularTotal() {
        return carrito.reduce((total, itemId) => {
            const producto = baseDeDatos.find(p => p.id === parseInt(itemId));
            return total + (producto ? producto.precio : 0);
        }, 0);
    }
    
    function actualizarTotales() {
        const total = calcularTotal();
        DOMtotal.textContent = formatearPrecio(total);
        DOMsubtotal.textContent = formatearPrecio(total);
    }

    // ========== ACTUALIZAR CONTADORES ==========
    
    function actualizarContadores() {
        const cantidad = carrito.length;
        DOMcartCount.textContent = cantidad;
        DOMcarritoValue.textContent = cantidad;
        
        // Animación del contador
        if (cantidad > 0) {
            DOMcarritoValue.style.display = 'flex';
            DOMcartCount.style.display = 'flex';
        } else {
            DOMcarritoValue.style.display = 'none';
            DOMcartCount.style.display = 'none';
        }
    }

    // ========== VACIAR CARRITO ==========
    
    function vaciarCarrito() {
        if (carrito.length === 0) return;
        
        if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            carrito = [];
            renderizarCarrito();
            guardarCarritoEnLocalStorage();
            actualizarContadores();
            mostrarToast('Carrito vaciado', 'Se han eliminado todos los productos', 'info');
        }
    }

    // ========== LOCAL STORAGE ==========
    
    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }
    
    function cargarCarritoDeLocalStorage() {
        const carritoGuardado = miLocalStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }
    }

    // ========== CONTADOR DE VISITAS ==========
    
    function actualizarContadorVisitas() {
        let visitas = localStorage.getItem('contadorVisitas') || 0;
        visitas = parseInt(visitas) + 1;
        localStorage.setItem('contadorVisitas', visitas);
        document.getElementById('contador').textContent = visitas;
    }

    // ========== NOTIFICACIONES TOAST ==========
    
    function mostrarToast(titulo, mensaje, tipo = 'success') {
        const toast = document.getElementById('toast');
        const icon = toast.querySelector('.toast-icon i');
        const titleElement = toast.querySelector('.toast-content h4');
        const messageElement = toast.querySelector('.toast-content p');
        
        // Actualizar contenido
        titleElement.textContent = titulo;
        messageElement.textContent = mensaje;
        
        // Actualizar icono según tipo
        if (tipo === 'success') {
            icon.className = 'fas fa-check';
            toast.className = 'toast-notification success show';
        } else if (tipo === 'warning') {
            icon.className = 'fas fa-exclamation-triangle';
            toast.className = 'toast-notification warning show';
        } else if (tipo === 'info') {
            icon.className = 'fas fa-info-circle';
            toast.className = 'toast-notification info show';
        }
        
        // Mostrar toast
        toast.classList.add('show');
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ========== EVENT LISTENERS ==========
    
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    filtroSelect.addEventListener('change', renderizarProductos);

    // ========== INICIALIZACIÓN ==========
    
    actualizarContadorVisitas();
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
    actualizarContadores();
    
    console.log('🛒 Carrito de compras ProdArt inicializado correctamente');
});

// ========== ANIMACIONES AL SCROLL ==========

window.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (cardTop < windowHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Inicializar opacity de cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
