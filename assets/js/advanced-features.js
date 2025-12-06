// ============================================================
// 🚀 FITZONE ADVANCED FEATURES - FUNCIONALIDADES AVANZADAS
// ============================================================

// ============================================================
// 1. SISTEMA DE NOTIFICACIONES TOAST
// ============================================================

function mostrarToast(mensaje, tipo = 'success') {
    // Crear contenedor de toasts si no existe
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Crear el toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${tipo}`;
    
    // Iconos según tipo
    const iconos = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    toast.innerHTML = `
        <div class="toast-icon">${iconos[tipo] || iconos.success}</div>
        <div class="toast-message">${mensaje}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    toastContainer.appendChild(toast);

    // Animación de entrada
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto-remover después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================================
// 2. SISTEMA DE FAVORITOS / WISHLIST
// ============================================================

let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

function toggleFavorito(nombre, precio, imagen) {
    const index = favoritos.findIndex(item => item.nombre === nombre);
    
    if (index > -1) {
        // Remover de favoritos
        favoritos.splice(index, 1);
        mostrarToast('Producto removido de favoritos', 'info');
    } else {
        // Agregar a favoritos
        favoritos.push({ nombre, precio, imagen });
        mostrarToast('¡Producto agregado a favoritos! ❤️', 'success');
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    actualizarIconosFavoritos();
}

function esFavorito(nombre) {
    return favoritos.some(item => item.nombre === nombre);
}

function actualizarIconosFavoritos() {
    document.querySelectorAll('.btn-favorito').forEach(btn => {
        const nombre = btn.dataset.nombre;
        if (esFavorito(nombre)) {
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            btn.classList.add('is-favorite');
        } else {
            btn.innerHTML = '<i class="far fa-heart"></i>';
            btn.classList.remove('is-favorite');
        }
    });

    // Actualizar contador de favoritos si existe
    const contadorFavoritos = document.getElementById('favoritos-count');
    if (contadorFavoritos) {
        contadorFavoritos.textContent = favoritos.length;
    }
}

// ============================================================
// 3. BÚSQUEDA EN TIEMPO REAL
// ============================================================

function buscarProductos(query) {
    const productos = document.querySelectorAll('.producto-item');
    const queryLower = query.toLowerCase().trim();

    if (queryLower === '') {
        productos.forEach(p => {
            p.style.display = '';
            p.classList.remove('search-hidden');
        });
        return;
    }

    productos.forEach(producto => {
        const nombre = producto.dataset.nombre?.toLowerCase() || '';
        const categoria = producto.dataset.categoria?.toLowerCase() || '';
        const descripcion = producto.dataset.descripcion?.toLowerCase() || '';

        if (nombre.includes(queryLower) || 
            categoria.includes(queryLower) || 
            descripcion.includes(queryLower)) {
            producto.style.display = '';
            producto.classList.remove('search-hidden');
        } else {
            producto.style.display = 'none';
            producto.classList.add('search-hidden');
        }
    });
}

// Autocompletado de búsqueda
function inicializarBusqueda() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            buscarProductos(e.target.value);
        });
    }
}

// ============================================================
// 4. FILTROS DE PRODUCTOS
// ============================================================

let filtrosActivos = {
    categoria: 'todas',
    precioMin: 0,
    precioMax: 1000000
};

function aplicarFiltros() {
    const productos = document.querySelectorAll('.producto-item');

    productos.forEach(producto => {
        const categoria = producto.dataset.categoria || '';
        const precio = parseInt(producto.dataset.precio) || 0;

        let mostrar = true;

        // Filtro de categoría
        if (filtrosActivos.categoria !== 'todas' && categoria !== filtrosActivos.categoria) {
            mostrar = false;
        }

        // Filtro de precio
        if (precio < filtrosActivos.precioMin || precio > filtrosActivos.precioMax) {
            mostrar = false;
        }

        // Mostrar u ocultar
        if (mostrar) {
            producto.style.display = '';
            producto.classList.remove('filter-hidden');
        } else {
            producto.style.display = 'none';
            producto.classList.add('filter-hidden');
        }
    });

    actualizarContadorProductos();
}

function cambiarCategoria(categoria) {
    filtrosActivos.categoria = categoria;
    aplicarFiltros();

    // Actualizar botones activos
    document.querySelectorAll('.btn-categoria').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function cambiarRangoPrecio(min, max) {
    filtrosActivos.precioMin = min;
    filtrosActivos.precioMax = max;
    aplicarFiltros();
}

function limpiarFiltros() {
    filtrosActivos = {
        categoria: 'todas',
        precioMin: 0,
        precioMax: 1000000
    };

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    document.querySelectorAll('.btn-categoria').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.btn-categoria[data-categoria="todas"]')?.classList.add('active');

    aplicarFiltros();
    buscarProductos('');
    mostrarToast('Filtros limpiados', 'info');
}

function actualizarContadorProductos() {
    const contador = document.getElementById('productos-count');
    if (contador) {
        const productosVisibles = document.querySelectorAll('.producto-item:not([style*="display: none"])').length;
        contador.textContent = `${productosVisibles} productos`;
    }
}

// ============================================================
// 5. MODAL DE VISTA RÁPIDA
// ============================================================

function mostrarVistaRapida(nombre, precio, imagen, descripcion) {
    // Crear modal si no existe
    let modal = document.getElementById('modal-vista-rapida');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-vista-rapida';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="cerrarVistaRapida()">×</button>
                <div class="modal-body">
                    <div class="modal-imagen">
                        <img id="modal-img" src="" alt="">
                    </div>
                    <div class="modal-info">
                        <h3 id="modal-nombre"></h3>
                        <h4 id="modal-precio"></h4>
                        <p id="modal-descripcion"></p>
                        <div class="modal-actions">
                            <button class="btn btn-primary" onclick="cerrarVistaRapida()">
                                <i class="fa fa-shopping-cart me-2"></i>Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Actualizar contenido
    document.getElementById('modal-img').src = imagen;
    document.getElementById('modal-nombre').textContent = nombre;
    document.getElementById('modal-precio').textContent = `$${precio.toLocaleString('es-CO')} COP`;
    document.getElementById('modal-descripcion').textContent = descripcion;

    // Mostrar modal
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function cerrarVistaRapida() {
    const modal = document.getElementById('modal-vista-rapida');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

// ============================================================
// 6. ANIMACIONES DE SCROLL
// ============================================================

function inicializarAnimacionesScroll() {
    const elementos = document.querySelectorAll('.scroll-animate');

    const observador = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    elementos.forEach(el => observador.observe(el));
}

// ============================================================
// 7. CARRITO FLOTANTE
// ============================================================

function actualizarCarritoFlotante() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrecio = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    // Actualizar todos los contadores del carrito
    document.querySelectorAll('.carrito-count').forEach(element => {
        element.textContent = totalCantidad;
        element.style.display = totalCantidad > 0 ? 'block' : 'none';
    });

    // Actualizar widget flotante si existe
    const widget = document.getElementById('carrito-flotante');
    if (widget && totalCantidad > 0) {
        widget.style.display = 'flex';
        widget.querySelector('.carrito-items-count').textContent = totalCantidad;
        widget.querySelector('.carrito-total-precio').textContent = `$${totalPrecio.toLocaleString('es-CO')}`;
    } else if (widget) {
        widget.style.display = 'none';
    }
}

function toggleCarritoFlotante() {
    const detalles = document.getElementById('carrito-flotante-detalles');
    if (detalles) {
        detalles.classList.toggle('show');
    }
}

// ============================================================
// 8. EFECTOS VISUALES AVANZADOS
// ============================================================

// Efecto parallax en hero
function inicializarParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Efecto de hover 3D en tarjetas
function inicializarHover3D() {
    document.querySelectorAll('.card-3d').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ============================================================
// 9. INICIALIZACIÓN GLOBAL
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las funcionalidades
    inicializarBusqueda();
    actualizarIconosFavoritos();
    actualizarCarritoFlotante();
    inicializarAnimacionesScroll();
    inicializarParallax();
    inicializarHover3D();
    actualizarContadorProductos();

    // Event listeners globales
    window.addEventListener('storage', (e) => {
        if (e.key === 'carrito') {
            actualizarCarritoFlotante();
        }
        if (e.key === 'favoritos') {
            actualizarIconosFavoritos();
        }
    });

    // Cerrar modal al hacer click fuera
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('modal-vista-rapida');
        if (e.target === modal) {
            cerrarVistaRapida();
        }
    });
});

// Exportar funciones para uso global
window.mostrarToast = mostrarToast;
window.toggleFavorito = toggleFavorito;
window.buscarProductos = buscarProductos;
window.aplicarFiltros = aplicarFiltros;
window.cambiarCategoria = cambiarCategoria;
window.limpiarFiltros = limpiarFiltros;
window.mostrarVistaRapida = mostrarVistaRapida;
window.cerrarVistaRapida = cerrarVistaRapida;
window.actualizarCarritoFlotante = actualizarCarritoFlotante;
window.toggleCarritoFlotante = toggleCarritoFlotante;
