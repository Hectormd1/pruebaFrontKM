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

// Función para obtener los items del carrito desde localStorage
const getCartItemsFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
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

// Función para guardar los items del carrito en localStorage
const saveCartItemsToStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(items));
  } catch (error) {
    console.warn('Error saving cart items:', error);
  }
};

// Provider
export function AppProvider({ children }: AppProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar el contador del carrito al inicializar
  useEffect(() => {
    const savedCount = getCartCountFromStorage();
    const savedItems = getCartItemsFromStorage();
    setCartCount(savedCount);
    setCartItems(savedItems);
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
      // Crear un item único pero conservando el ID original del producto
      const cartItem = { 
        ...item, 
        cartId: `${item.id}-${item.colorCode}-${item.storageCode}-${Date.now()}` 
      };
      const newItems = [...cartItems, cartItem];
      
      setCartCount(newCount);
      setCartItems(newItems);
      saveCartCountToStorage(newCount);
      saveCartItemsToStorage(newItems);
    } catch (err) {
      setError('Error al añadir producto al carrito');
      console.error('Error adding to cart:', err);
      throw err;
    }
  }, [cartCount, cartItems]);

  // Eliminar del carrito
  const removeFromCart = useCallback((cartId: string) => {
    const newItems = cartItems.filter(item => item.cartId !== cartId);
    const newCount = Math.max(0, cartCount - 1);
    
    setCartItems(newItems);
    setCartCount(newCount);
    saveCartItemsToStorage(newItems);
    saveCartCountToStorage(newCount);
  }, [cartItems, cartCount]);

  const value: AppContextType = {
    products,
    cartCount,
    cartItems,
    isLoading,
    error,
    loadProducts,
    addToCart,
    removeFromCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContext };
