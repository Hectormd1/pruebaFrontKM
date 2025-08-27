import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

// Hook personalizado para usar el contexto
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
}
