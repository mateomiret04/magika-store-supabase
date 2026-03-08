import { Routes } from '@angular/router';
import { StoreLayoutComponent } from './components/store/store-layout/store-layout';
import { Productos } from './components/store/productos/productos';
import { CarritoComponent } from './components/store/carrito/carrito'; // <-- Importamos el nuevo componente

export const routes: Routes = [
  {
    path: '', 
    component: StoreLayoutComponent, // El Layout principal que contiene el Navbar
    children: [
      { 
        path: '', 
        component: Productos // Lo que se ve al entrar a la web (Home)
      },
      { 
        path: 'carrito', 
        component: CarritoComponent // Lo que se ve al navegar a /carrito
      }
    ]
  },
  // Opcional: Redirigir cualquier ruta desconocida al inicio
  { path: '**', redirectTo: '' }
];