import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import Header from '../components/Header';

describe('Header', () => {
  it('muestra el título y el contador del carrito', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <Header />
        </AppProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Mobile Store/i)).toBeInTheDocument();
    expect(screen.getByText(/Carrito:/i)).toBeInTheDocument();
  });
});
