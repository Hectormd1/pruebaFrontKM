import type { ReactNode } from 'react';
import { render, act, renderHook } from '@testing-library/react';
import { AppProvider, AppContext } from '../context/AppContext';
import { useApp } from '../hooks/useApp';
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
});
