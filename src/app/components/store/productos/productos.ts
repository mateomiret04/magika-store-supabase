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
  // Evento para avisar al layout (Padre) que el dibujo terminó
  @Output() productosListos = new EventEmitter<void>();

  listaProductos: any[] = [];
  listaFiltrada: any[] = []; 
  
  terminoBusqueda: string = '';
  categoriaActual: string = 'Todas';
  
  cargando: boolean = false;
  productoSeleccionado: any = null;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private cdRef: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    // 1. Cargamos los datos iniciales
    this.cargarProductos();

    // 2. Escuchamos cambios en el buscador (con tipado explícito para evitar error TS7006)
    this.productoService.buscadorActual$.subscribe((termino: string) => {
      this.terminoBusqueda = termino;
      this.aplicarFiltros();
    });

    // 3. Escuchamos cambios en las categorías (con tipado explícito)
    this.productoService.categoriaActual$.subscribe((cat: string) => {
      this.categoriaActual = cat;
      this.aplicarFiltros();
    });
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data: any[]) => {
        this.listaProductos = data;
        console.log('📦 [Hijo] Datos recibidos de la API:', this.listaProductos.length);
        
        // Ejecutamos el filtro inicial
        this.aplicarFiltros();
        
        // 1. Forzamos a Angular a procesar los cambios
        this.cdRef.detectChanges(); 
        
        // 2. BUFFER DE RENDERIZADO (300ms)
        setTimeout(() => {
          this.productoService.notificarCargaFinalizada(true);
          this.productosListos.emit(); 
          console.log('🚀 [Hijo] Renderizado de cards completado. Avisando al Layout.');
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
    // Si aún no hay productos, no filtramos
    if (!this.listaProductos || this.listaProductos.length === 0) return;

    const term = this.terminoBusqueda.toLowerCase().trim();

    this.listaFiltrada = this.listaProductos.filter(p => {
      // Filtro de Categoría
      const coincideCategoria = this.categoriaActual === 'Todas' || p.categoria === this.categoriaActual;

      // Filtro de Texto (Nombre, Descripción o Categoría)
      const coincideTexto = 
        p.nombre.toLowerCase().includes(term) || 
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
    this.carritoService.agregarProducto(producto);
    console.log(`✅ Agregado al carrito: ${producto.nombre}`);
    this.cdRef.detectChanges();
  }
}