import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // 1. Array privado donde guardamos los productos físicamente
  private listaProductos: any[] = [];

  // 2. El BehaviorSubject es el "corazón" reactivo. 
  // Empieza con un array vacío [].
  private carritoSubject = new BehaviorSubject<any[]>([]);
  
  // 3. Este es el "canal" que el Navbar y el Carrito están escuchando (subscribe)
  carrito$ = this.carritoSubject.asObservable();

  constructor() {}

  // MÉTODO PARA AGREGAR PRODUCTOS
  agregarProducto(producto: any) {
    this.listaProductos.push(producto);
    // Notificamos a todos los componentes enviando una copia actualizada del array
    this.carritoSubject.next([...this.listaProductos]);
    console.log('✅ Servicio: Producto agregado. Total:', this.listaProductos.length);
  }

  // MÉTODO PARA ELIMINAR PRODUCTOS (Este es el que falta y causa el error)
  eliminarProducto(index: number) {
    if (index > -1 && index < this.listaProductos.length) {
      // Borramos el elemento del array interno
      this.listaProductos.splice(index, 1);
      
      // ¡IMPORTANTE!: Notificamos el cambio para que el Navbar baje el número
      this.carritoSubject.next([...this.listaProductos]);
      console.log('🗑️ Servicio: Producto eliminado. Quedan:', this.listaProductos.length);
    }
  }

  // Método auxiliar para obtener el estado actual si fuera necesario
  obtenerCantidadActual(): number {
    return this.listaProductos.length;
  }
}