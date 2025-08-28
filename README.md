# Prueba Frontend React – Compra de Dispositivos Móviles

Este proyecto es una Single Page Application (SPA) desarrollada con **React**, **Vite** y **TypeScript**. Permite explorar y comprar dispositivos móviles, integrando una API externa y gestionando el estado del carrito de compras con persistencia local.

## Tecnologías principales

- [React](https://react.dev/) con TypeScript
- [Vite](https://vitejs.dev/) como build tool
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) para estilos
- [React Router DOM](https://reactrouter.com/) para navegación
- [Heroicons](https://heroicons.com/) para iconografía
- [Jest](https://jestjs.io/) y [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) para testing

## Estructura del proyecto

```
src/
  components/   # Componentes reutilizables (Header)
  pages/        # Vistas principales (ProductList, ProductDetail)
  services/     # Lógica de acceso a APIs y cacheo
  hooks/        # Custom hooks (useApp)
  context/      # Context API para estado global
  utils/        # Utilidades (slugify, etc.)
  types/        # Definiciones de tipos TypeScript
  test/         # Tests unitarios y de integración
```

## Scripts disponibles

- `npm install`   – Instala las dependencias
- `npm start`   – Arranca el modo desarrollo (Vite)
- `npm run dev`   – Arranca el modo desarrollo (Vite)
- `npm test`   – Ejecuta todos los tests
- `npm run test:watch`   – Ejecuta tests en modo watch
- `npm test -- --coverage`   – Ejecuta tests con reporte de cobertura
- `npm run build` – Compila para producción
- `npm run lint`  – Ejecuta ESLint para análisis de código
- `npm run preview` – Preview de la build de producción

## Características principales

### Funcionalidad de E-commerce
- **Carrito de compras sencillo**: Carrito reactivo que se actualiza según vas añadiendo productos
- **Gestión de productos**: Listado con búsqueda y filtros
- **Detalles de producto**: Vista detallada con selección de color y almacenamiento
- **Navegación breadcrumb**: Navegación contextual automática

### Interfaz de Usuario
- **Diseño responsivo** con Tailwind CSS
- **Contador en tiempo real** del carrito en el header
- **Estados de loading** y manejo de errores

### Arquitectura Técnica
- **Context API** para estado global (AppContext)
- **Custom hooks** (useApp) para lógica reutilizable
- **TypeScript** con tipado estricto en toda la aplicación
- **React Router** con rutas dinámicas basadas en slugs

### Persistencia y Cache
- **localStorage** para persistencia del carrito
- **Sistema de cache** con expiración automática (1 hora)
- **Manejo robusto de errores** en operaciones de almacenamiento

### Testing
- **Cobertura de código** superior al 88%
- **Tests unitarios** para todos los componentes principales
- **Tests de integración** para Context API y hooks
- **Mocking** de servicios externos y localStorage

## Funcionalidades específicas

### Carrito de Compras
- Persistencia automática en localStorage
- Contador visual en el header

### Navegación
- Lista de productos con búsqueda en tiempo real
- Vista detallada de cada producto
- Breadcrumbs dinámicos basados en la URL
- URLs amigables generadas automáticamente con slugify

### Cache y Performance
- Cache inteligente de productos con expiración
- Reintentos automáticos en fallos de API
- Optimización de renders con useCallback y Context API

## Instalación y Uso

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Hectormd1/pruebaFrontKM.git
   cd pruebaFrontKM
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```
  o
  ```bash
   npm start
   ```


4. **Abre tu navegador**
   - La aplicación estará disponible en `http://localhost:5173`

### Comandos útiles para desarrollo

```bash
# Ejecutar tests con cobertura
npm test -- --coverage

# Ejecutar solo el linter
npm run lint

# Construir para producción
npm run build

# Preview de la build
npm run preview
```

## API Externa

La aplicación se conecta a una API externa para:
- **Obtener lista de productos**: `GET /api/product`
- **Obtener detalles de producto**: `GET /api/product/{id}`
- **Añadir productos al carrito**: `POST /api/cart`

Los datos se cachean automáticamente para mejorar el rendimiento.