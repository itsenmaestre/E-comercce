// ============================================================
// 🍔 MENÚ HAMBURGUESA Y NAVEGACIÓN
// ============================================================

// Crear menú hamburguesa
function crearMenuHamburguesa() {
    const menu = `
        <!-- Overlay del menú -->
        <div class="hamburger-overlay" id="hamburger-overlay" onclick="toggleHamburgerMenu()"></div>
        
        <!-- Menú lateral -->
        <div class="hamburger-menu" id="hamburger-menu">
            <button class="hamburger-close" onclick="toggleHamburgerMenu()">×</button>
            
            <h3 style="color: #38B6FF; margin-bottom: 30px;">
                <i class="fa fa-bars me-2"></i>Navegación
            </h3>
            
            <ul class="hamburger-nav">
                <li><a href="index.html"><i class="fa fa-home"></i>Inicio</a></li>
                <li><a href="acercade.html"><i class="fa fa-info-circle"></i>Acerca de</a></li>
                <li><a href="productos_general.html"><i class="fa fa-box"></i>Productos</a></li>
                <li><a href="compras.html"><i class="fa fa-shopping-cart"></i>Mi Carrito</a></li>
                <li><a href="contacto.html"><i class="fa fa-envelope"></i>Contacto</a></li>
            </ul>
            
            <hr class="border-secondary my-4">
            
            <div style="padding: 0 20px;">
                <h5 style="color: #b4b4b4; font-size: 14px; margin-bottom: 15px;">
                    <i class="fa fa-heart me-2 text-danger"></i>Favoritos (<span id="favoritos-count-menu">0</span>)
                </h5>
                <button class="btn w-100" style="background: #38B6FF; color: #0d1113; font-weight: 600;" onclick="window.location.href='compras.html'">
                    Ver Carrito
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', menu);
}

// Toggle menú
function toggleHamburgerMenu() {
    const menu = document.getElementById('hamburger-menu');
    const overlay = document.getElementById('hamburger-overlay');

    if (menu && overlay) {
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    }
}

// ============================================================
// 🛒 CARRITO FLOTANTE
// ============================================================

function crearCarritoFlotante() {
    const carritoWidget = `
        <div id="carrito-flotante" style="display: none;" onclick="window.location.href='compras.html'">
            <div class="carrito-icon">
                <i class="fa fa-shopping-cart"></i>
            </div>
            <div class="carrito-info">
                <span class="carrito-items-count">0</span> items
                <div class="carrito-total-precio">$0</div>
            </div>
            <span class="carrito-count">0</span>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', carritoWidget);
}

// ============================================================
// 🔄 ACTUALIZAR CONTADOR DEL NAVBAR
// ============================================================

function actualizarContadorNavbar() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    // Actualizar contador en navbar
    const contadorNavbar = document.getElementById('carrito-count');
    if (contadorNavbar) {
        contadorNavbar.textContent = totalCantidad;
        contadorNavbar.style.display = totalCantidad > 0 ? 'block' : 'none';
    }

    // Actualizar contador en menú hamburguesa  
    const contadorMenu = document.getElementById('favoritos-count-menu');
    if (contadorMenu) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        contadorMenu.textContent = favoritos.length;
    }
}

// ============================================================
// 🔄 INICIALIZACIÓN
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Crear elementos UI
    crearMenuHamburguesa();
    crearCarritoFlotante();

    // Actualizar contadores
    actualizarContadorNavbar();
    if (typeof actualizarCarritoFlotante === 'function') {
        actualizarCarritoFlotante();
    }

    // Actualizar clase active en menú según página actual
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.hamburger-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Exportar funciones
window.toggleHamburgerMenu = toggleHamburgerMenu;
window.actualizarContadorNavbar = actualizarContadorNavbar;
