import { render, screen, fireEvent } from '@testing-library/react';
import { Cart } from '../components/Cart';
import * as appHook from '../hooks/useApp';

// Mock del hook useApp
jest.mock('../hooks/useApp');

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('no muestra contador cuando cartCount es 0', () => {
    (appHook.useApp as jest.Mock).mockReturnValue({
      cartCount: 0,
      cartItems: [],
      removeFromCart: jest.fn(),
      products: []
    });

    render(<Cart />);
    
    expect(screen.getByTitle('Ver carrito')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('muestra contador cuando cartCount es mayor a 0', () => {
    (appHook.useApp as jest.Mock).mockReturnValue({
      cartCount: 3,
      cartItems: [],
      removeFromCart: jest.fn(),
      products: []
    });

    render(<Cart />);
    
    expect(screen.getByTitle('Ver carrito')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('muestra 99+ cuando cartCount es mayor a 99', () => {
    (appHook.useApp as jest.Mock).mockReturnValue({
      cartCount: 150,
      cartItems: [],
      removeFromCart: jest.fn(),
      products: []
    });

    render(<Cart />);
    
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('abre modal cuando se hace clic en el botón', () => {
    const mockRemoveFromCart = jest.fn();
    (appHook.useApp as jest.Mock).mockReturnValue({
      cartCount: 2,
      cartItems: [
        {
          id: '1',
          colorCode: 1000,
          storageCode: 2000,
          colorName: 'Black',
          storageName: '32 GB',
          cartId: 'test-1'
        }
      ],
      removeFromCart: mockRemoveFromCart,
      products: [
        {
          id: '1',
          brand: 'Test Brand',
          model: 'Test Model',
          price: '100'
        }
      ]
    });

    render(<Cart />);
    
    // Hacer clic en el botón del carrito
    fireEvent.click(screen.getByTitle('Ver carrito'));
    
    // Verificar que el modal se abre
    expect(screen.getByText('Tu Carrito')).toBeInTheDocument();
    expect(screen.getByText('Test Brand Test Model')).toBeInTheDocument();
    expect(screen.getByText('Black • 32 GB')).toBeInTheDocument();
  });

  it('muestra carrito vacío cuando no hay items', () => {
    (appHook.useApp as jest.Mock).mockReturnValue({
      cartCount: 0,
      cartItems: [],
      removeFromCart: jest.fn(),
      products: []
    });

    render(<Cart />);
    
    // Abrir modal
    fireEvent.click(screen.getByTitle('Ver carrito'));
    
    // Verificar mensaje de carrito vacío
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  it('cierra modal al hacer clic en X', () => {
    (appHook.useApp as jest.Mock).mockReturnValue({
      cartCount: 1,
      cartItems: [],
      removeFromCart: jest.fn(),
      products: []
    });

    render(<Cart />);
    
    // Abrir modal
    fireEvent.click(screen.getByTitle('Ver carrito'));
    expect(screen.getByText('Tu Carrito')).toBeInTheDocument();
    
    // Cerrar modal
    fireEvent.click(screen.getByText('×'));
    
    // Verificar que el modal se cerró
    expect(screen.queryByText('Tu Carrito')).not.toBeInTheDocument();
  });

  it('cierra modal al hacer clic fuera del contenido', () => {
    (appHook.useApp as jest.Mock).mockReturnValue({
      cartCount: 1,
      cartItems: [],
      removeFromCart: jest.fn(),
      products: []
    });

    render(<Cart />);
    
    // Abrir modal
    fireEvent.click(screen.getByTitle('Ver carrito'));
    expect(screen.getByText('Tu Carrito')).toBeInTheDocument();
    
    // Hacer clic en el overlay (fondo)
    const overlay = screen.getByText('Tu Carrito').closest('.fixed');
    fireEvent.click(overlay!);
    
    // Verificar que el modal se cerró
    expect(screen.queryByText('Tu Carrito')).not.toBeInTheDocument();
  });

  it('permite eliminar items del carrito', () => {
    const mockRemoveFromCart = jest.fn();
    (appHook.useApp as jest.Mock).mockReturnValue({
      cartCount: 1,
      cartItems: [
        {
          id: '1',
          colorCode: 1000,
          storageCode: 2000,
          colorName: 'Black',
          storageName: '32 GB',
          cartId: 'test-1'
        }
      ],
      removeFromCart: mockRemoveFromCart,
      products: [
        {
          id: '1',
          brand: 'Test Brand',
          model: 'Test Model',
          price: '100'
        }
      ]
    });

    render(<Cart />);
    
    // Abrir modal
    fireEvent.click(screen.getByTitle('Ver carrito'));
    
    // Hacer clic en eliminar
    fireEvent.click(screen.getByTitle('Eliminar del carrito'));
    
    // Verificar que se llamó removeFromCart
    expect(mockRemoveFromCart).toHaveBeenCalledWith('test-1');
  });

  it('muestra información fallback cuando no hay colorName/storageName', () => {
    (appHook.useApp as jest.Mock).mockReturnValue({
      cartCount: 1,
      cartItems: [
        {
          id: '1',
          colorCode: 1000,
          storageCode: 2000,
          cartId: 'test-1'
          // Sin colorName ni storageName
        }
      ],
      removeFromCart: jest.fn(),
      products: [
        {
          id: '1',
          brand: 'Test Brand',
          model: 'Test Model',
          price: '100'
        }
      ]
    });

    render(<Cart />);
    
    // Abrir modal
    fireEvent.click(screen.getByTitle('Ver carrito'));
    
    // Verificar que muestra códigos como fallback
    expect(screen.getByText('Color (1000) • Almacenamiento (2000)')).toBeInTheDocument();
  });

  it('calcula y muestra el total correctamente', () => {
    (appHook.useApp as jest.Mock).mockReturnValue({
      cartCount: 2,
      cartItems: [
        {
          id: '1',
          colorCode: 1000,
          storageCode: 2000,
          colorName: 'Black',
          storageName: '32 GB',
          cartId: 'test-1'
        },
        {
          id: '2',
          colorCode: 1000,
          storageCode: 2000,
          colorName: 'White',
          storageName: '64 GB',
          cartId: 'test-2'
        }
      ],
      removeFromCart: jest.fn(),
      products: [
        {
          id: '1',
          brand: 'Test Brand',
          model: 'Test Model',
          price: '100'
        },
        {
          id: '2',
          brand: 'Another Brand',
          model: 'Another Model',
          price: '200'
        }
      ]
    });

    render(<Cart />);
    
    // Abrir modal
    fireEvent.click(screen.getByTitle('Ver carrito'));
    
    // Verificar total
    expect(screen.getByText('Total: 300.00 €')).toBeInTheDocument();
  });
});
