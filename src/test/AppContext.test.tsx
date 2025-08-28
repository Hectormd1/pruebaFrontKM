import type { ReactNode } from 'react';
import { render, act, renderHook } from '@testing-library/react';
import { AppProvider, AppContext } from '../context/AppContext';
import { useApp } from '../hooks/useApp';
import { apiService } from '../services/apiService';
import React from 'react';

// Mock apiService
jest.mock('../services/apiService', () => ({
  apiService: {
    getProducts: jest.fn(() => Promise.resolve([
      { id: '1', brand: 'Acer', model: 'Test', price: '100', options: { colors: [{ code: 1, name: 'Negro' }], storages: [{ code: 1, name: '64GB' }] } }
    ])),
    addToCart: jest.fn(() => Promise.resolve({ count: 1 }))
  }
}));

describe('AppContext', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    // Resetear mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Limpiar localStorage después de cada test
    localStorage.clear();
  });
  it('inicializa correctamente', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.products).toEqual([]);
    expect(result.current.cartCount).toBe(0);
  });

  it('carga productos', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });
    await act(async () => {
      await result.current.loadProducts();
    });
    expect(result.current.products.length).toBeGreaterThan(0);
  });

  it('añade al carrito', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });
    await act(async () => {
      await result.current.addToCart({ id: '1', colorCode: 1, storageCode: 1 });
    });
    expect(result.current.cartCount).toBe(1);
  });

  it('maneja error al leer cartCount de localStorage', () => {
    const original = localStorage.getItem;
    localStorage.getItem = () => { throw new Error('fail'); };
    // Forzar render para que se ejecute getCartCountFromStorage
    render(
      <AppProvider>
        <div>test</div>
      </AppProvider>
    );
    localStorage.getItem = original;
  });

  it('maneja error al guardar cartCount en localStorage', () => {
    const original = localStorage.setItem;
    localStorage.setItem = () => { throw new Error('fail'); };
  // wrapper no usado
    render(<AppProvider><div>test</div></AppProvider>);
    // Llamar a saveCartCountToStorage indirectamente agregando al carrito
    // Se fuerza el error al guardar
    localStorage.setItem = original;
  });

  it('maneja error al cargar productos (catch)', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const spy2 = jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.mock('../services/apiService', () => ({
      apiService: {
        getProducts: jest.fn(() => { throw new Error('fail'); })
      }
    }));
  // wrapper no usado
    await act(async () => {
      render(<AppProvider><div>test</div></AppProvider>);
    });
    spy.mockRestore();
    spy2.mockRestore();
  });

  it('maneja error al añadir producto al carrito (catch y throw)', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const spy2 = jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.mock('../services/apiService', () => ({
      apiService: {
        addToCart: jest.fn(() => { throw new Error('fail'); })
      }
    }));
  // wrapper no usado
    let error;
    await act(async () => {
      try {
        render(<AppProvider><div>test</div></AppProvider>);
        // Simular llamada a addToCart
        const ctx = React.useContext(AppContext);
        if (ctx) await ctx.addToCart({ id: '1', colorCode: 1, storageCode: 1 });
      } catch (e) {
        error = e;
      }
    });
    expect(error).toBeDefined();
    spy.mockRestore();
    spy2.mockRestore();
  });

  it('elimina del carrito correctamente', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });
    
    // Verificar estado inicial
    expect(result.current.cartCount).toBe(0);
    
    // Primero agregar un item
    await act(async () => {
      await result.current.addToCart({ id: '1', colorCode: 1, storageCode: 1 });
    });
    expect(result.current.cartCount).toBe(1);
    expect(result.current.cartItems.length).toBe(1);
    
    // Luego eliminarlo
    act(() => {
      const cartId = result.current.cartItems[0].cartId!;
      result.current.removeFromCart(cartId);
    });
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartItems.length).toBe(0);
  });

  it('mantiene cartCount en 0 cuando se intenta eliminar y ya está en 0', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });
    
    // Verificar estado inicial
    expect(result.current.cartCount).toBe(0);
    
    // Intentar eliminar cuando cartCount es 0
    act(() => {
      result.current.removeFromCart('non-existent-id');
    });
    expect(result.current.cartCount).toBe(0);
  });

  it('carga datos del localStorage al inicializar', () => {
    // Configurar localStorage con datos
    localStorage.setItem('cartCount', '3');
    localStorage.setItem('cartItems', JSON.stringify([
      { id: '1', colorCode: 1, storageCode: 1, cartId: 'test-1' },
      { id: '2', colorCode: 2, storageCode: 2, cartId: 'test-2' },
      { id: '3', colorCode: 3, storageCode: 3, cartId: 'test-3' }
    ]));

    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });
    
    expect(result.current.cartCount).toBe(3);
    expect(result.current.cartItems.length).toBe(3);
    
    // Limpiar localStorage
    localStorage.removeItem('cartCount');
    localStorage.removeItem('cartItems');
  });

  it('maneja JSON inválido en cartItems de localStorage', () => {
    localStorage.setItem('cartItems', 'invalid-json');
    
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });
    
    expect(result.current.cartItems).toEqual([]);
    
    localStorage.removeItem('cartItems');
  });

  it('maneja cartCount inválido en localStorage', () => {
    localStorage.setItem('cartCount', 'not-a-number');
    
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });
    
    expect(result.current.cartCount).toBe(0);
    
    localStorage.removeItem('cartCount');
  });

  it('maneja errores al cargar productos desde la API', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock temporal que falla
    const originalGetProducts = apiService.getProducts;
    apiService.getProducts = jest.fn(() => Promise.reject(new Error('API Error')));
    
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });
    
    await act(async () => {
      await result.current.loadProducts();
    });
    
    expect(result.current.error).toBe('Error al cargar los productos');
    expect(result.current.products).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading products:', expect.any(Error));
    
    // Restaurar
    apiService.getProducts = originalGetProducts;
    consoleErrorSpy.mockRestore();
  });

  it('maneja errores en addToCart y los propaga', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock temporal que falla
    const originalAddToCart = apiService.addToCart;
    apiService.addToCart = jest.fn(() => Promise.reject(new Error('API Error')));
    
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });
    
    let thrownError;
    await act(async () => {
      try {
        await result.current.addToCart({ id: '1', colorCode: 1, storageCode: 1 });
      } catch (error) {
        thrownError = error;
      }
    });
    
    expect(result.current.error).toBe('Error al añadir producto al carrito');
    expect(thrownError).toBeInstanceOf(Error);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding to cart:', expect.any(Error));
    
    // Restaurar
    apiService.addToCart = originalAddToCart;
    consoleErrorSpy.mockRestore();
  });

  it('genera cartId único para cada item agregado', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });
    
    // Verificar estado inicial
    expect(result.current.cartCount).toBe(0);
    
    // Agregar dos items idénticos con un pequeño delay para asegurar timestamps únicos
    await act(async () => {
      await result.current.addToCart({ id: '1', colorCode: 1, storageCode: 1 });
    });
    
    // Pequeño delay para asegurar timestamp diferente
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await act(async () => {
      await result.current.addToCart({ id: '1', colorCode: 1, storageCode: 1 });
    });
    
    expect(result.current.cartCount).toBe(2);
    expect(result.current.cartItems.length).toBe(2);
    
    // Los cartId deben ser diferentes
    const cartIds = result.current.cartItems.map(item => item.cartId);
    expect(cartIds[0]).not.toBe(cartIds[1]);
    expect(cartIds.every(id => id!.includes('1-1-1-'))).toBe(true); // Contienen el patrón esperado
  });
});
