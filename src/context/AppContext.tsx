import { createContext, useState, useCallback, useEffect } from 'react';
import type { Product, CartItem, AppContextType, AppProviderProps } from '../types';
import { apiService } from '../services/apiService';

const AppContext = createContext<AppContextType | undefined>(undefined);

// Función para obtener el contador del carrito desde localStorage
const getCartCountFromStorage = (): number => {
  try {
    const stored = localStorage.getItem('cartCount');
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

// Función para guardar el contador del carrito en localStorage
const saveCartCountToStorage = (count: number): void => {
  try {
    localStorage.setItem('cartCount', count.toString());
  } catch (error) {
    console.warn('Error saving cart count:', error);
  }
};

// Provider
export function AppProvider({ children }: AppProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar el contador del carrito al inicializar
  useEffect(() => {
    const savedCount = getCartCountFromStorage();
    setCartCount(savedCount);
  }, []);

  // Cargar productos
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedProducts = await apiService.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Añadir al carrito
  const addToCart = useCallback(async (item: CartItem) => {
    try {
      await apiService.addToCart(item);
      
      // Como la API siempre devuelve count: 1, manejamos el contador localmente
      const newCount = cartCount + 1;
      setCartCount(newCount);
      saveCartCountToStorage(newCount);
    } catch (err) {
      setError('Error al añadir producto al carrito');
      console.error('Error adding to cart:', err);
      throw err;
    }
  }, [cartCount]);

  const value: AppContextType = {
    products,
    cartCount,
    isLoading,
    error,
    loadProducts,
    addToCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContext };
