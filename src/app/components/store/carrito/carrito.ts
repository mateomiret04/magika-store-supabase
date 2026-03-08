import { Component, OnInit, Output, EventEmitter } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../services/carrito';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.html',
  styles: [] 
})
export class CarritoComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();

  productosEnCarrito: any[] = [];
  total: number = 0; // Este será el total final con descuentos aplicados

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(productos => {
      this.productosEnCarrito = productos;
      this.total = this.obtenerSubtotalBase() - this.obtenerTotalDescuentos();
      console.log('🛒 [Vista Carrito] Sincronizado con el servicio. Items:', productos.length);
    });
  }

  // 1. Sumatoria de Precios Base (Sumatoria pura sin descuentos)
  obtenerSubtotalBase(): number {
    return this.productosEnCarrito.reduce((acc, p) => acc + Number(p.precio_base || 0), 0);
  }

  // 2. Sumatoria de todos los montos descontados (Dinero que se resta)
  obtenerTotalDescuentos(): number {
    return this.productosEnCarrito.reduce((acc, p) => {
      const precio = Number(p.precio_base || 0);
      const porcentaje = Number(p.descuento || 0);
      const montoDescontado = porcentaje > 0 ? (precio * (porcentaje / 100)) : 0;
      return acc + montoDescontado;
    }, 0);
  }

  // SENSOR NIVEL 3: Detecta si el botón del carrito realmente emite la señal
  cerrarCarrito() {
    console.log('--- NIVEL 3: El Carrito pide cerrarse (Hijo emitiendo) ---');
    this.cerrar.emit();
  }

  eliminar(index: number) {
    this.carritoService.eliminarProducto(index);
  }

  finalizarPedido() {
    if (this.productosEnCarrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const numeroTelefono = "543447510342"; 
    
    // Generamos la lista de texto incluyendo el detalle de descuento si existe
    const listaTexto = this.productosEnCarrito
      .map(p => {
        const precioConDescuento = Number(p.precio_base) - (Number(p.precio_base) * (Number(p.descuento || 0) / 100));
        return `- ${p.nombre} ($${Math.round(precioConDescuento)})`;
      })
      .join('%0A'); 
    
    const mensaje = `Hola Magika! %0A%0AQuisiera realizar el siguiente pedido:%0A${listaTexto}%0A%0A*Total: $${Math.round(this.total)}*%0A%0A¿Cómo podemos coordinar la entrega?`;

    const url = `https://wa.me/${numeroTelefono}?text=${mensaje}`;
    window.open(url, '_blank');
  }
}