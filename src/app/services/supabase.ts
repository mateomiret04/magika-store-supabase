import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Inicializamos la conexión con las llaves que pusiste en environment.ts
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Este método será el que llames desde tu componente de la tienda
  async getProductos() {
    const { data, error } = await this.supabase
      .from('productos') // El nombre exacto de la tabla que creamos
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al obtener productos de Supabase:', error.message);
      return [];
    }

    return data;
  }
}