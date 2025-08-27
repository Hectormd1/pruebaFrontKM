import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import type { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { cartItems, removeFromCart, products } = useApp();

  if (!isOpen) return null;

  const getProductInfo = (item: CartItem) => {
    const product = products.find(p => p.id === item.id);
    return product || { brand: 'Producto', model: 'Desconocido', price: '0' };
  };

  // Obtener el nombre del color
  const getColorName = (item: CartItem) => {
    // Si el item ya tiene el nombre guardado, lo usamos
    if (item.colorName) {
      return item.colorName;
    }
    
    // Fallback: intentar encontrar el color en la lista de productos
    const product = products.find(p => p.id === item.id);
    if (product?.options?.colors) {
      const color = product.options.colors.find(c => Number(c.code) === Number(item.colorCode));
      return color?.name || `Color (${item.colorCode})`;
    }
    
    return `Color (${item.colorCode})`;
  };

  // Obtener el nombre del almacenamiento
  const getStorageName = (item: CartItem) => {
    // Si el item ya tiene el nombre guardado, lo usamos
    if (item.storageName) {
      return item.storageName;
    }
    
    // Fallback: intentar encontrar el almacenamiento en la lista de productos
    const product = products.find(p => p.id === item.id);
    if (product?.options?.storages) {
      const storage = product.options.storages.find(s => Number(s.code) === Number(item.storageCode));
      return storage?.name || `Almacenamiento (${item.storageCode})`;
    }
    
    return `Almacenamiento (${item.storageCode})`;
  };

  // Calcular el total de precios
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const productInfo = getProductInfo(item);
      const price = parseFloat(productInfo.price) || 0;
      return total + price;
    }, 0);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full mx-4 max-h-96 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Tu Carrito</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-64 p-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-800 text-center py-8">Tu carrito está vacío</p>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => {
                const productInfo = getProductInfo(item);
                const itemKey = item.cartId || `${item.id}-${item.colorCode}-${item.storageCode}`;
                return (
                  <div key={itemKey} className="flex justify-between items-center p-3 bg-gray-200 text-gray-800 rounded">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{productInfo.brand} {productInfo.model}</h3>
                      <p className="text-xs text-gray-600">
                        {getColorName(item)} • {getStorageName(item)}
                      </p>
                      <p className="text-xs text-gray-800">{productInfo.price} €</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(itemKey)}
                      className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      title="Eliminar del carrito"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="p-4 border-t bg-gray-50 text-gray-800">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total: {getTotalPrice().toFixed(2)} €</span>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                onClick={() => alert('Funcionalidad de checkout próximamente...')}
              >
                Proceder al pago
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Cart = () => {
  const { cartCount } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative p-2 text-white hover:text-gray-200 transition-colors"
        title="Ver carrito"
      >
        {/* Icono del carrito */}
        <ShoppingCartIcon className="w-6 h-6" strokeWidth={1.5} />
        
        {/* Badge con contador */}
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>

      <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
