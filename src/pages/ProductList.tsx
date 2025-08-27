import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { slugify } from "../utils/slugify";
import { useApp } from "../hooks/useApp";
import type { Product } from "../types";

const ProductList: React.FC = () => {
  const { products, isLoading, error, loadProducts, addToCart } = useApp();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setFiltered(
      products.filter(
        (product) =>
          product.model.toLowerCase().includes(search.toLowerCase()) ||
          product.brand.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);

  const handleAddToCart = async (product: Product) => {
    try {
      // Usar el primer color y almacenamiento disponible como valores por defecto
      const colorCode = product.options?.colors?.[0]?.code || 1;
      const storageCode = product.options?.storages?.[0]?.code || 1;
      
      await addToCart({
        id: product.id,
        colorCode,
        storageCode
      });
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-500">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button 
            onClick={loadProducts}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Listado de productos</h1>
        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por modelo o marca..."
          className="w-full sm:w-72 px-3 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No se encontraron productos.
          </div>
        ) : (
          filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
            >
              <Link to={`/${slugify(product.brand + " " + product.model)}`} className="w-full flex flex-col items-center group">
                <img
                  src={product.imgUrl}
                  alt={product.model}
                  className="w-24 h-24 object-cover mb-2 group-hover:scale-105 transition-transform"
                />
                <div className="font-semibold group-hover:text-pink-600 transition-colors">{product.model}</div>
                <div className="text-sm text-gray-500 mb-2">{product.brand}</div>
                <div className="font-bold text-blue-600 mb-2">{product.price || "-"} €</div>
              </Link>
              <button 
                onClick={() => handleAddToCart(product)}
                className="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Agregar al carrito
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
