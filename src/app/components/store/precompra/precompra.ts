import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../services/carrito'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-precompra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './precompra.html',
  styles: []
})
export class PrecompraComponent {
  @Input() producto: any = null;
  @Output() close = new EventEmitter<void>();

  cantidad: number = 1;

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {}

  // Cierra el modal y resetea la cantidad
  cerrarModal() {
    this.close.emit();
    this.cantidad = 1;
  }

  // Maneja el contador del modal (+/-)
  cambiarCantidad(delta: number) {
    if (this.cantidad + delta >= 1) {
      this.cantidad += delta;
    }
  }

  // OPCIÓN 1: Añade al carrito interno y permite seguir navegando
  agregarYContinuar() {
    if (this.producto) {
      for (let i = 0; i < this.cantidad; i++) {
        this.carritoService.agregarProducto(this.producto);
      }
      console.log(`✅ Se añadieron ${this.cantidad} unidad(es) de: ${this.producto.nombre}`);
      this.cerrarModal(); 
    }
  }

  // OPCIÓN 2: COMPRA DIRECTA (Salto al WhatsApp)
  // No redirige al carrito, envía la orden directamente
  comprarAhora() {
    if (!this.producto) return;

    const numeroTelefono = "543447510342";
    const totalCompra = this.producto.precio_base * this.cantidad;
    
    // Armamos el mensaje para un único producto con su cantidad
    const mensaje = `Hola Magika! %0A%0AQuisiera realizar el siguiente pedido:%0A- ${this.producto.nombre} (Cantidad: ${this.cantidad})%0A%0A*Total: $${totalCompra}*%0A%0A`;

    // Generamos la URL de la API de WhatsApp
    const url = `https://wa.me/${numeroTelefono}?text=${mensaje}`;
    
    // Abrimos WhatsApp en una nueva pestaña
    window.open(url, '_blank');
    
    // Cerramos el modal para limpiar la vista del usuario
    this.cerrarModal();
  }
}