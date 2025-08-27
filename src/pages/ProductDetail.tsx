import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";
import type { Product } from "../types";
import { apiService } from "../services/apiService";
import { useApp } from "../hooks/useApp";

const ProductDetail: React.FC = () => {
  const { productName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedColorCode, setSelectedColorCode] = useState<string>("");
  const [selectedStorageCode, setSelectedStorageCode] = useState<string>("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Primero obtenemos todos los productos para encontrar el ID por el slug
        const products = await apiService.getProducts();
        const foundProduct = products.find((p) => slugify(p.brand + " " + p.model) === productName);
        
        if (!foundProduct) {
          setError("Producto no encontrado");
          return;
        }

        // Ahora obtenemos los detalles completos del producto
        const productDetail = await apiService.getProduct(foundProduct.id);
        setProduct(productDetail);
        
        // Establecer valores por defecto para los selectores
        if (productDetail.options?.colors?.length > 0) {
          setSelectedColorCode(productDetail.options.colors[0].code.toString());
        }
        if (productDetail.options?.storages?.length > 0) {
          setSelectedStorageCode(productDetail.options.storages[0].code.toString());
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    if (productName) {
      loadProduct();
    }
  }, [productName]);

  const retryLoadProduct = () => {
    if (productName) {
      const loadProduct = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Primero obtenemos todos los productos para encontrar el ID por el slug
          const products = await apiService.getProducts();
          const foundProduct = products.find((p) => slugify(p.brand + " " + p.model) === productName);
          
          if (!foundProduct) {
            setError("Producto no encontrado");
            return;
          }

          // Ahora obtenemos los detalles completos del producto
          const productDetail = await apiService.getProduct(foundProduct.id);
          setProduct(productDetail);
          
          // Establecer valores por defecto para los selectores
          if (productDetail.options?.colors?.length > 0) {
            setSelectedColorCode(productDetail.options.colors[0].code.toString());
          }
          if (productDetail.options?.storages?.length > 0) {
            setSelectedStorageCode(productDetail.options.storages[0].code.toString());
          }
          
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error al cargar el producto");
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedColorCode || !selectedStorageCode) return;

    try {
      setAddingToCart(true);
      await addToCart({
        id: product.id,
        colorCode: parseInt(selectedColorCode),
        storageCode: parseInt(selectedStorageCode)
      });
    } catch (err) {
      console.error("Error al añadir al carrito:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Producto no encontrado"}</p>
          <div className="space-x-4">
            <button
              onClick={retryLoadProduct}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Reintentar
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Volver a la lista de productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center text-gray-500">
        Producto no encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header con botón de volver */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
          >
            ← Volver a la lista de productos
          </button>
        </div>
      </div>

      {/* Vista de detalles */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Imagen del producto */}
            <div className="lg:w-1/3 p-2 bg-gray-50 flex items-center justify-center">
              <img
                src={product.imgUrl}
                alt={`${product.brand} ${product.model}`}
                className="max-w-full max-h-80 object-contain rounded-lg"
              />
            </div>

            {/* Información del producto */}
            <div className="lg:w-2/3 p-8">
              {/* Description */}
              <div className="mb-8">
                <div className="inline-flex justify-normal">
                <p className="text-2xl font-medium text-gray-900 mb-2 mr-2">
                  {product.brand}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {product.model}
                </p>
                </div>

                {/* Descripción del producto */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-4">
                  Descripción del producto
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Marca</span>
                        <span className="text-sm text-gray-900 mt-1">{product.brand}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Modelo</span>
                        <span className="text-sm text-gray-900 mt-1">{product.model}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">CPU</span>
                        <span className="text-sm text-gray-900 mt-1">{product.cpu || "-"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">RAM</span>
                        <span className="text-sm text-gray-900 mt-1">{product.ram || "-"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Sistema Operativo</span>
                        <span className="text-sm text-gray-900 mt-1">{product.os || "-"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Resolución de pantalla</span>
                        <span className="text-sm text-gray-900 mt-1">{product.displayResolution || "-"}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Precio</span>
                        <span className="text-sm text-gray-900 mt-1">{product.price} €</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Batería</span>
                        <span className="text-sm text-gray-900 mt-1">{product.battery || "-"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Cámaras</span>
                        <span className="text-sm text-gray-900 mt-1">{product.primaryCamera || "-"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Dimensiones</span>
                        <span className="text-sm text-gray-900 mt-1">{product.dimentions || "-"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Peso</span>
                        <span className="text-sm text-gray-900 mt-1">{product.weight || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-6">
                {/* Selector de Almacenamiento */}
                {product.options?.storages && product.options.storages.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Almacenamiento:
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {product.options.storages.map((storage) => (
                        <button
                          key={storage.code}
                          onClick={() => setSelectedStorageCode(storage.code.toString())}
                          className={`px-4 py-2 border rounded-md transition-colors ${
                            selectedStorageCode === storage.code.toString()
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-900 border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {storage.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selector de Color */}
                {product.options?.colors && product.options.colors.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Color:
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {product.options.colors.map((color) => (
                        <button
                          key={color.code}
                          onClick={() => setSelectedColorCode(color.code.toString())}
                          className={`px-4 py-2 border rounded-md transition-colors ${
                            selectedColorCode === color.code.toString()
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-900 border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botón de Añadir al carrito */}
                <div className="pt-4 flex justify-center">
                  <button 
                    onClick={handleAddToCart}
                    disabled={addingToCart || !selectedColorCode || !selectedStorageCode}
                    className="w-fit bg-blue-600 hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    {addingToCart ? "Añadiendo..." : "Añadir al carrito"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
