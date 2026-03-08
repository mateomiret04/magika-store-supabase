import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <--- Importamos el motor de peticiones HTTP

// --- CONFIGURACIÓN PARA FORMATO ARGENTINA ($ 12.000,00) ---
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEsAr);
// --------------------------------------------------------

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideRouter(routes),
    provideHttpClient(), // <--- Habilitamos el servicio para toda la aplicación
    
    // Establecemos el idioma Argentina como predeterminado para toda la App
    { provide: LOCALE_ID, useValue: 'es-AR' }
  ],
};