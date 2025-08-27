import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { unslugify } from '../utils/slugify';

const breadcrumbsMap: Record<string, string> = {
  '/': 'Inicio',
  '/productos': 'Productos',
  '/detalle': 'Detalle',
};

const Header: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const crumbs = path.split('/').filter(Boolean);

  // Función para obtener el nombre del breadcrumb
  const getBreadcrumbName = (pathSegment: string): string => {
    const fullPath = '/' + pathSegment;
    if (breadcrumbsMap[fullPath]) {
      return breadcrumbsMap[fullPath];
    }
    // Si no está en el mapa, probablemente es un nombre de producto (slug)
    // Lo convertimos de vuelta a formato legible
    return unslugify(pathSegment);
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-gray-900 text-white shadow">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-2xl cursor-pointer select-none hover:text-pink-400 transition-colors">
          📱 Mobile Store
        </Link>
        {/* <Link to="/productos" className="ml-4 text-lg hover:text-pink-400 transition-colors">
          Productos
        </Link> */}
         {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="ml-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-300">
            <li>
              <Link to="/" className="hover:underline">Inicio</Link>
            </li>
            {crumbs.length > 0 && (
              <div className="flex items-center">
                <span className="mr-1">/</span>
                <li className="capitalize mx-1">
                  {getBreadcrumbName(crumbs[crumbs.length - 1])}
                </li>
              </div>
            )}
          </ol>
        </nav>
      </div>
      <div>
        {/* TODO crear funcionalidad al carrito */}
        <span className="bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold">Carrito: 0</span>
      </div>
    </header>
  );
};

export default Header;