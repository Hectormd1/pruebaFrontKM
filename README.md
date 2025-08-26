# Prueba Frontend React – Compra de Dispositivos Móviles

Este proyecto es una Single Page Application (SPA) desarrollada con **React**, **Vite** y **TypeScript**. Permite explorar y comprar dispositivos móviles, integrando una API externa y gestionando el estado del carrito de compras.

## Tecnologías principales

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)

## Estructura del proyecto

```
src/
  components/   # Componentes reutilizables (Header, etc.)
  pages/        # Vistas principales de la app
  services/     # Lógica de acceso a APIs
  hooks/        # Custom hooks
  utils/        # Utilidades generales
```

## Scripts disponibles

- `npm install`   – Instala las dependencias
- `npm run dev`   – Arranca el modo desarrollo
- `npm run build` – Compila para producción
- `npm run lint`  – Ejecuta el linter

## Características

- SPA con React Router
- Estilos con Tailwind CSS
- Integración con API para productos y carrito
- Cacheo de datos en cliente (expiración: 1 hora)
- Estructura modular y fácil de mantener

## Uso

1. Clona el repositorio y entra en la carpeta del proyecto.
2. Instala las dependencias:
  npm install
  
3. Arranca el modo desarrollo:
  npm run dev
