import type { CacheEntry } from '../types';

const CACHE_DURATION = 60 * 60 * 1000; // 1 hora en milisegundos

class CacheService {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  // Guardar datos en cache
  set<T>(key: string, data: T, customDuration?: number): void {
    const expiresIn = customDuration || CACHE_DURATION;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };
    
    this.cache.set(key, entry);
    
    // También guardamos en localStorage como respaldo
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      console.warn('Error al guardar en localStorage:', error);
    }
  }

  // Obtener datos del cache
  get<T>(key: string): T | null {
    let entry = this.cache.get(key);
    
    // Si no está en memoria, intentamos obtenerlo de localStorage
    if (!entry) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          entry = JSON.parse(stored);
          if (entry) {
            this.cache.set(key, entry);
          }
        }
      } catch (error) {
        console.warn('Error al leer de localStorage:', error);
        return null;
      }
    }
    
    if (!entry) {
      return null;
    }
    
    // Verificar si ha expirado
    const now = Date.now();
    if (now - entry.timestamp > entry.expiresIn) {
      this.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  // Eliminar entrada del cache
  delete(key: string): void {
    this.cache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('Error al eliminar de localStorage:', error);
    }
  }

  // Limpiar todo el cache
  clear(): void {
    this.cache.clear();
    try {
      // Eliminar todas las entradas de cache del localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Error al limpiar localStorage:', error);
    }
  }

  // Verificar si una entrada existe y es válida
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const cacheService = new CacheService();
