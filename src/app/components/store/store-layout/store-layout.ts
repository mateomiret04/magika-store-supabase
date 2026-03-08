import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarStoreComponent } from '../navbar-store/navbar-store'; 
import { CarritoComponent } from '../carrito/carrito'; 
import { SupabaseService } from '../../../services/supabase'; // Cambiado al nuevo servicio
import { ProductoService } from '../../../services/producto'; 

@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarStoreComponent, CarritoComponent],
  templateUrl: './store-layout.html',
})
export class StoreLayoutComponent implements OnInit, OnDestroy {
  
  cargandoEfecto: boolean = true;
  mostrarCarrito: boolean = false; 
  
  // Lógica de Categorías Dinámicas
  categoriaSeleccionada: string = 'Todas';
  categoriasUnicas: string[] = []; 

  // Control de sincronización
  private tiempoMinimoCumplido: boolean = false;
  private productosCargados: boolean = false;

  constructor(
    private supabaseService: SupabaseService, // Inyectamos Supabase
    private productoService: ProductoService, // Mantenemos este para la comunicación entre componentes
    private cdRef: ChangeDetectorRef 
  ) {}

  async ngOnInit(): Promise<void> {
    // 1. Cronómetro de identidad (2 segundos)
    setTimeout(() => {
      this.tiempoMinimoCumplido = true;
      console.log('⏱️ [Layout] Tiempo mínimo de 2s cumplido.');
      this.verificarYFinalizarCarga();
    }, 2000);

    // 2. Carga de datos desde Supabase
    try {
      const productos = await this.supabaseService.getProductos();
      
      if (productos && productos.length > 0) {
        // Actualizamos el servicio de comunicación interna para que otros componentes se enteren
        this.productoService.actualizarProductos(productos);
        
        // Extraemos categorías
        const cats = productos
          .map(p => p.categoria)
          .filter(c => c && c.trim() !== '');
        
        this.categoriasUnicas = [...new Set(cats)].sort() as string[];
        
        this.productosCargados = true;
        console.log('📦 [Layout] Productos cargados desde Supabase.');
        this.verificarYFinalizarCarga();
      } else {
        // Si no hay productos, igual finalizamos la carga para no quedar trabados
        this.productosCargados = true;
        this.verificarYFinalizarCarga();
      }
    } catch (error) {
      console.error('❌ Error al cargar productos de Supabase:', error);
      this.productosCargados = true;
      this.verificarYFinalizarCarga();
    }
  }

  private verificarYFinalizarCarga() {
    if (this.tiempoMinimoCumplido && this.productosCargados) {
      console.log('🚀 [Layout] Liberando Magika Store con datos de Supabase.');
      this.cargandoEfecto = false;
      this.cdRef.detectChanges();
    }
  }

  toggleCarrito(estado: boolean) {
    this.mostrarCarrito = estado;
    this.cdRef.detectChanges(); 
  }

  onSearch(event: any) {
    const input = event.target as HTMLInputElement;
    const term = input.value ? input.value : '';
    this.productoService.actualizarTerminoBusqueda(term);
  }

  seleccionarCategoria(cat: string) {
    this.categoriaSeleccionada = cat;
    this.productoService.actualizarCategoria(cat);
  }

  ngOnDestroy(): void {
    // Ya no necesitamos desuscribirnos de la carga inicial porque usamos async/await
  }
}