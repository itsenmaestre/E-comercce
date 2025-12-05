// ===============================
// CARRITO AVANZADO FITZONE
// ===============================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar productos al carrito
function addToCart(nombre, precio, imagen) {
    const producto = carrito.find(item => item.nombre === nombre);

    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({
            nombre,
            precio,
            cantidad: 1,
            imagen
        });
    }

    guardarCarrito();
    actualizarCarritoHTML();
    alert("Producto agregado al carrito ✔");
}

// Eliminar un producto totalmente
function eliminarProducto(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    guardarCarrito();
    actualizarCarritoHTML();
}

// Cambiar cantidad (+ / -)
function cambiarCantidad(nombre, valor) {
    const producto = carrito.find(item => item.nombre === nombre);

    if (!producto) return;

    producto.cantidad += valor;

    if (producto.cantidad <= 0) {
        eliminarProducto(nombre);
    } else {
        guardarCarrito();
    }

    actualizarCarritoHTML();
}

// Calcular total
function calcularTotal() {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

// Render del carrito en compras.html
function actualizarCarritoHTML() {
    const contenedor = document.getElementById("carrito-contenedor");
    const totalHTML = document.getElementById("total-precio");
    
    if (!contenedor) return;

    contenedor.innerHTML = "";

    carrito.forEach(item => {
        contenedor.innerHTML += `
            <div class="card mb-3 p-3" style="background:#11161a; border:1px solid #1c2328; border-radius:12px;">
                <div class="row g-3 align-items-center">
                    
                    <div class="col-md-3 text-center">
                        <img src="${item.imagen}" class="img-fluid rounded-3" style="height:130px; object-fit:cover;">
                    </div>

                    <div class="col-md-6 text-light">
                        <h4 class="fw-bold">${item.nombre}</h4>
                        <p class="text-secondary">Precio unitario: $${item.precio.toLocaleString("es-CO")}</p>

                        <div class="d-flex align-items-center gap-3 mt-2">

                            <button class="btn btn-sm btn-outline-light" onclick="cambiarCantidad('${item.nombre}', -1)">−</button>

                            <span class="fw-bold">${item.cantidad}</span>

                            <button class="btn btn-sm btn-outline-info" onclick="cambiarCantidad('${item.nombre}', 1)">+</button>

                        </div>

                    </div>

                    <div class="col-md-3 text-end text-light">
                        <h5 class="fw-bold">Subtotal:</h5>
                        <h5 style="color:#38B6FF;">
                            $${(item.precio * item.cantidad).toLocaleString("es-CO")}
                        </h5>

                        <button class="btn btn-danger btn-sm mt-2"
                            onclick="eliminarProducto('${item.nombre}')">
                            Eliminar
                        </button>
                    </div>

                </div>
            </div>
        `;
    });

    totalHTML.innerHTML = "$" + calcularTotal().toLocaleString("es-CO");
}

// Ejecutar cuando se carga compras.html
document.addEventListener("DOMContentLoaded", actualizarCarritoHTML);
