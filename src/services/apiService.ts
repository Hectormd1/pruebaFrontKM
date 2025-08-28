import type { Product, CartItem, CartResponse } from '../types';
import { cacheService } from './cacheService';

const API_BASE_URL = 'https://itx-frontend-test.onrender.com';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 segundo

class ApiService {
  private async fetchWithRetries(url: string, options?: RequestInit): Promise<Response> {
    let lastError: Error = new Error('Error desconocido');
    
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return response;
      } catch (error) {
        lastError = error as Error;
        
        // Si no es el último intento, esperar antes de reintentar
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    throw new Error(`Falló después de ${MAX_RETRIES + 1} intentos: ${lastError.message}`);
  }
  
  // Obtener listado de productos
  async getProducts(): Promise<Product[]> {
    const cacheKey = 'products';
    
    // Intentar obtener del cache primero
    const cachedProducts = cacheService.get<Product[]>(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }

    try {
      const response = await this.fetchWithRetries(`${API_BASE_URL}/api/product`);
      if (!response.ok) {
        throw new Error('No se pudo cargar el listado de productos');
      }
      const products: Product[] = await response.json();
      // Guardar en cache
      cacheService.set(cacheKey, products);
      return products;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw new Error('No se pudieron cargar los productos. Por favor, inténtelo más tarde.');
    }
  }

  // Obtener detalle de un producto específico
  async getProduct(id: string): Promise<Product> {
    const cacheKey = `product_${id}`;
    
    // Intentar obtener del cache primero
    const cachedProduct = cacheService.get<Product>(cacheKey);
    if (cachedProduct) {
      return cachedProduct;
    }

    try {
      const response = await this.fetchWithRetries(`${API_BASE_URL}/api/product/${id}`);
      const product: Product = await response.json();
      
      // Guardar en cache
      cacheService.set(cacheKey, product);      
      return product;

    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error);
      throw new Error(`No se pudo cargar el producto. Por favor, inténtelo más tarde.`);
    }
  }

  // Añadir producto al carrito
  async addToCart(item: CartItem): Promise<CartResponse> {
    try {
      const response = await this.fetchWithRetries(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      const cartResponse: CartResponse = await response.json(); 
      return cartResponse;

    } catch (error) {
      console.error('Error al añadir producto al carrito:', error);
      throw new Error('No se pudo añadir el producto al carrito. Por favor, inténtelo más tarde.');
    }
  }
}

export const apiService = new ApiService();
