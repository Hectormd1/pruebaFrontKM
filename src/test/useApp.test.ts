import { renderHook } from '@testing-library/react';
import { useApp } from '../hooks/useApp';
import { AppProvider } from '../context/AppContext';
import React from 'react';

describe('useApp', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(AppProvider, null, children);
  };

  it('devuelve el contexto correctamente dentro del provider', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current).toHaveProperty('products');
    expect(result.current).toHaveProperty('cartCount');
    expect(result.current).toHaveProperty('addToCart');
    expect(result.current).toHaveProperty('loadProducts');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
  });

  it('lanza error si se usa fuera del provider', () => {
    let error;
    try {
      renderHook(() => useApp());
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('valores por defecto del contexto', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(Array.isArray(result.current.products)).toBe(true);
    expect(typeof result.current.cartCount).toBe('number');
    expect(typeof result.current.addToCart).toBe('function');
    expect(typeof result.current.loadProducts).toBe('function');
    expect(typeof result.current.isLoading).toBe('boolean');
    // error puede ser null o string
    expect(['string', 'object']).toContain(typeof result.current.error);
  });
});
