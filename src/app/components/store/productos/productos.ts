import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto'; 
import { CarritoService } from '../../../services/carrito'; 
import { PrecompraComponent } from '../precompra/precompra'; 

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, PrecompraComponent], 
  templateUrl: './productos.html',
  styles: [], 
})
export class Productos implements OnInit {
  @Output() productosListos = new EventEmitter<void>();

  listaProductos: any[] = [];
  listaFiltrada: any[] = []; 
  
  terminoBusqueda: string = '';
  categoriaActual: string = 'Todas';
  
  cargando: boolean = false;
  productoSeleccionado: any = null;
  productoEfectoId: number | null = null;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private cdRef: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    if (this.productoService.tieneProductos()) {
      this.usarDatosCache();
    } else {
      this.cargarProductos();
    }

    this.productoService.buscadorActual$.subscribe((termino: string) => {
      this.terminoBusqueda = termino;
      this.aplicarFiltros();
    });

    this.productoService.categoriaActual$.subscribe((cat: string) => {
      this.categoriaActual = cat;
      this.aplicarFiltros();
    });
  }

  private usarDatosCache() {
    this.productoService.getProductos().subscribe(data => {
      this.listaProductos = data;
      this.aplicarFiltros();
      this.productoService.notificarCargaFinalizada(true);
      this.productosListos.emit();
      this.cdRef.detectChanges();
    });
  }

  optimizarImagen(url: string): string {
    // 1. Validación de seguridad
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return 'assets/placeholder-magika.jpg';
    }

    // 2. Si es de Supabase, optimizamos sin forzar el formato webp
    if (url.includes('supabase.co')) {
      // Usamos un separador inteligente por si la URL ya tiene parámetros
      const separador = url.includes('?') ? '&' : '?';
      
      // Eliminamos '&format=webp' que es lo que disparaba el Error 400
      return `${url}${separador}width=500&quality=75`;
    }

    // 3. Si no es de Supabase, devolvemos la URL original
    return url;
  }
  
  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data: any[]) => {
        this.listaProductos = data;
        this.aplicarFiltros();
        this.cdRef.detectChanges(); 
        
        setTimeout(() => {
          this.productoService.notificarCargaFinalizada(true);
          this.productosListos.emit(); 
        }, 300); 
      },
      error: (err) => {
        console.error('❌ Error al conectar con la API de Magika:', err);
        this.productoService.notificarCargaFinalizada(true);
        this.productosListos.emit();
      }
    });
  }

  aplicarFiltros() {
    if (!this.listaProductos || this.listaProductos.length === 0) return;
    const term = this.terminoBusqueda.toLowerCase().trim();
    this.listaFiltrada = this.listaProductos.filter(p => {
      const coincideCategoria = this.categoriaActual === 'Todas' || p.categoria === this.categoriaActual;
      const coincideTexto = 
        (p.nombre && p.nombre.toLowerCase().includes(term)) || 
        (p.descripcion && p.descripcion.toLowerCase().includes(term)) ||
        (p.categoria && p.categoria.toLowerCase().includes(term));
      return coincideCategoria && coincideTexto;
    });
    this.cdRef.detectChanges();
  }

  abrirModal(producto: any) {
    this.productoSeleccionado = producto;
    this.cdRef.detectChanges(); 
  }

  cerrarModal() {
    this.productoSeleccionado = null;
    this.cdRef.detectChanges();
  }

  agregarAlCarrito(producto: any) {
    this.productoEfectoId = producto.id;
    this.carritoService.agregarProducto(producto);
    this.cdRef.detectChanges();

    setTimeout(() => {
      this.productoEfectoId = null;
      this.cdRef.detectChanges();
    }, 300);
  }

  trackByProductoId(index: number, producto: any): number {
    return producto.id;
  }
}