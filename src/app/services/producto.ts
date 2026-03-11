import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  
  // 1. Centralizamos los productos aquí. 
  // Si ya tiene datos, los componentes los recibirán al instante.
  private productosSource = new BehaviorSubject<any[]>([]);
  productos$ = this.productosSource.asObservable();

  // --- Lógica de Carga ---
  private productosListosSource = new BehaviorSubject<boolean>(false);
  productosListos$ = this.productosListosSource.asObservable();

  // --- Lógica de Búsqueda ---
  private buscadorSource = new BehaviorSubject<string>('');
  buscadorActual$ = this.buscadorSource.asObservable();

  // --- Lógica de Categorías ---
  private categoriaSource = new BehaviorSubject<string>('Todas');
  categoriaActual$ = this.categoriaSource.asObservable();

  constructor() { }

  /**
   * 🚀 MÉTODO CLAVE: Actualiza el estado global de productos.
   * Si el array que llega tiene datos, marcamos que la carga terminó.
   */
  actualizarProductos(productos: any[]) {
    if (productos && productos.length > 0) {
      console.log('📦 [ProductoService] Cache actualizado con', productos.length, 'productos.');
      this.productosSource.next(productos);
      this.productosListosSource.next(true); 
    }
  }

  /**
   * Retorna los productos actuales. 
   * Si ya hay productos guardados, el componente los obtendrá de inmediato sin delay.
   */
  getProductos(): Observable<any[]> {
    return this.productos$;
  }

  /**
   * 💡 MÉTODO DE INGENIERÍA: Permite al componente saber si ya tenemos datos
   * para evitar mostrar pantallas de carga o "rueditas" innecesarias.
   */
  tieneProductos(): boolean {
    return this.productosSource.getValue().length > 0;
  }

  // Notifica al Layout manualmente si fuera necesario
  notificarCargaFinalizada(estado: boolean) {
    this.productosListosSource.next(estado);
  }

  // Actualiza el término de búsqueda globalmente
  actualizarTerminoBusqueda(term: string) {
    this.buscadorSource.next(term);
  }

  // Actualiza la categoría
  actualizarCategoria(categoria: string) {
    this.categoriaSource.next(categoria);
  }

  /**
   * Útil si la dueña quiere forzar una actualización manual
   */
  limpiarCache() {
    this.productosSource.next([]);
    this.productosListosSource.next(false);
  }
}