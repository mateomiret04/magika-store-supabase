import { Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core'; // Añadimos Output y EventEmitter
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../../services/carrito';

@Component({
  selector: 'app-navbar-store',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-store.html',
})
export class NavbarStoreComponent implements OnInit {
  // CONFIGURACIÓN DEL SENSOR: El "grito" hacia el padre
  @Output() clickCarrito = new EventEmitter<void>();

  isScrolled = false;
  menuAbierto = false;
  cantidadCarrito = 0;

  constructor(
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(productos => {
      this.cantidadCarrito = productos.length;
      console.log('🔔 [Navbar] Cantidad actualizada:', this.cantidadCarrito);
    });
  }

  // SENSOR 1: Detección de clic en la bolsa
  irAlCarrito() {
    console.log('--- NIVEL 1: Navbar detectó el clic en la bolsa ---'); 
    this.clickCarrito.emit(); // Envía la señal al StoreLayout
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuAbierto = !this.menuAbierto;
  }

  @HostListener('document:click', [])
  closeMenu() {
    this.menuAbierto = false;
  }
}