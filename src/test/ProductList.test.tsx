import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import ProductList from '../pages/ProductList';

import { apiService } from '../services/apiService';

jest.mock('../services/apiService', () => ({
  apiService: {
    getProducts: jest.fn(() => Promise.resolve([
      { id: '1', brand: 'Acer', model: 'Test', price: '100', imgUrl: '', options: { colors: [{ code: 1, name: 'Negro' }], storages: [{ code: 1, name: '64GB' }] } }
    ]))
  }
}));

describe('ProductList', () => {
  it('renderiza productos y permite buscar', async () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <ProductList />
        </AppProvider>
      </BrowserRouter>
    );
    expect(await screen.findByText('Test')).toBeInTheDocument();
    const input = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(input, { target: { value: 'acer' } });
    expect(await screen.findByText('Test')).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'noexiste' } });
    expect(screen.queryByText('Test')).toBeNull();
  });

  it('muestra mensaje si no hay productos', async () => {
    // Mock sin productos
    (apiService.getProducts as jest.Mock).mockResolvedValueOnce([]);
    render(
      <BrowserRouter>
        <AppProvider>
          <ProductList />
        </AppProvider>
      </BrowserRouter>
    );
    expect(await screen.findByText(/no se encontraron productos/i)).toBeInTheDocument();
  });
});
