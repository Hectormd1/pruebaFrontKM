// Tipos para la API
export interface Product {
  id: string;
  brand: string;
  model: string;
  price: string;
  cpu: string;
  ram: string;
  os: string;
  displayResolution: string;
  battery: string;
  primaryCamera: string[];
  secondaryCamara: string[];
  dimentions: string;
  weight: string;
  imgUrl: string;
  options: {
    colors: Color[];
    storages: Storage[];
  };
}

export interface Color {
  code: number;
  name: string;
}

export interface Storage {
  code: number;
  name: string;
}

export interface CartItem {
  id: string;
  colorCode: number;
  storageCode: number;
  colorName?: string; // Nombre del color
  storageName?: string; // Nombre del almacenamiento
  cartId?: string; // ID único para el carrito
}

export interface CartResponse {
  count: number;
}

// Tipos para el cacheo
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // en milisegundos
}

// Tipos para el estado de la aplicación
export interface AppState {
  cartCount: number;
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

// Tipos para el contexto de la aplicación
export interface AppContextType {
  products: Product[];
  cartCount: number;
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (cartId: string) => void;
}

// Tipos para props de componentes
export interface AppProviderProps {
  children: React.ReactNode;
}

// Tipos para funciones de utilidad
export type SlugifyFunction = (text: string) => string;
