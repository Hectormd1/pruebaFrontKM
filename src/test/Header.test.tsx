import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter} from 'react-router-dom';
import Header from '../components/Header';
import * as router from 'react-router-dom';
import * as appHook from '../hooks/useApp';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));
jest.mock('../hooks/useApp', () => ({
  useApp: jest.fn()
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (appHook.useApp as jest.Mock).mockReturnValue({ cartCount: 0 });
    (router.useLocation as jest.Mock).mockReturnValue({ pathname: '/' });
  });

  it('renderiza el título y el enlace de inicio', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText(/mobile store/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument();
  });

  it('muestra el contador del carrito', () => {
    (appHook.useApp as jest.Mock).mockReturnValue({ cartCount: 5 });
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    // El contador se muestra como un badge con solo el número
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('muestra breadcrumb dinámico para slug', () => {
    (router.useLocation as jest.Mock).mockReturnValue({ pathname: '/samsung-galaxy' });
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    // El slug se debe mostrar "Samsung Galaxy" (unslugify)
    expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();
    expect(screen.getByText(/mobile store/i)).toBeInTheDocument();
  });

  it('muestra breadcrumb de inicio si está en /', () => {
    (router.useLocation as jest.Mock).mockReturnValue({ pathname: '/' });
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('renderiza correctamente varios niveles de ruta', () => {
    (router.useLocation as jest.Mock).mockReturnValue({ pathname: '/productos/iphone-15' });
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    // El último breadcrumb debe ser "Iphone 15"
    expect(screen.getByText('Iphone 15')).toBeInTheDocument();
  });
});
