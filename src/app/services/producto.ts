import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  
  // Guardamos los productos en un BehaviorSubject para que cualquier componente pueda acceder a ellos
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
   * 🚀 MÉTODO CLAVE: Recibe los productos desde Supabase (vía StoreLayout)
   * y los distribuye a todos los componentes que estén escuchando.
   */
  actualizarProductos(productos: any[]) {
    console.log('📦 [ProductoService] Actualizando lista con', productos.length, 'productos de Supabase');
    this.productosSource.next(productos);
    this.productosListosSource.next(true); // Avisamos que la carga terminó
  }

  /**
   * Retorna los productos como un Observable. 
   * Lo mantenemos para que tus componentes actuales no se rompan.
   */
  getProductos(): Observable<any[]> {
    return this.productos$;
  }

  // Notifica al Layout manualmente si fuera necesario
  notificarCargaFinalizada(estado: boolean) {
    this.productosListosSource.next(estado);
  }

  // Actualiza el término de búsqueda globalmente
  actualizarTerminoBusqueda(term: string) {
    this.buscadorSource.next(term);
  }

  // Actualiza la categoría desde el Navbar o el Layout
  actualizarCategoria(categoria: string) {
    this.categoriaSource.next(categoria);
  }
}