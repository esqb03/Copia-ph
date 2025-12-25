import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";

const API_URL = import.meta.env.VITE_API_URL;

interface ProductBase {
  id: number | string;
  name: string;
  list_price: number;
  price: number;
  image_512?: string;
  qty_available: number;
  default_code?: string;
  description_sale?: string;
  [key: string]: any;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  isDanger: boolean;
  showCancel: boolean;
}

interface ProductSearchCardProps {
  onAdd: (product: ProductBase) => void;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}

export default function ProductSearchCard({
  onAdd,
  setModalState,
}: ProductSearchCardProps) {
  const [products, setProducts] = useState<ProductBase[]>([]);
  const [filtered, setFiltered] = useState<ProductBase[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // -------------------- FILTRO POR TEXTO --------------------
  useEffect(() => {
    if (query.trim() === "") {
      setFiltered(products);
      return;
    }

    const lower = query.toLowerCase();
    const result = products
      .filter((p) => p.qty_available > 0)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          (p.default_code && p.default_code.toLowerCase().includes(lower))
      );

    setFiltered(result);
  }, [query, products]);

  // -------------------- FETCH DE PRODUCTOS --------------------
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      let baseArray: ProductBase[] = [];

      if (Array.isArray(data)) {
        baseArray = data;
      } else if (data.products && Array.isArray(data.products)) {
        baseArray = data.products;
      } else {
        setError("Formato de datos inesperado de la API.");
        setLoading(false);
        return;
      }

      const productsWithStock = baseArray.filter((p) => (p.qty_available ?? 0) > 0);
      setProducts(productsWithStock);
      setFiltered(productsWithStock);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddInternal = (product: ProductBase) => {
    if (product.qty_available <= 0) {
        setModalState({
          isOpen: true,
          title: "⚠️ Sin Stock",
          message: `El producto "${product.name}" no tiene unidades disponibles.`,
          onConfirm: () => setModalState((p) => ({ ...p, isOpen: false })),
          onCancel: () => setModalState((p) => ({ ...p, isOpen: false })),
          confirmText: "Aceptar",
          isDanger: false,
          showCancel: false,
        });
        return;
    }

    // Agregamos al carrito sin notificaciones (minimalista)
    onAdd(product);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col h-full font-sans">
      {/* HEADER + BUSCADOR */}
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Productos disponibles
        </h2>
        <p className="text-xs text-gray-500 mb-3">
          Busca por nombre o código y agrega productos al pedido.
        </p>

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar producto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full p-3 pl-10 rounded-lg 
              bg-[#faf6f1]
              border border-[#a89076]
              text-gray-800
              placeholder:text-gray-500
              /* text-base (16px) previene el zoom automático en móviles */
              text-base
              focus:border-[#967d63] 
              focus:ring-1 focus:ring-[#a89076]
              transition outline-none
            "
            disabled={loading}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {loading && (
        <div className="text-center p-4 text-[#a89076] text-sm">
          Cargando productos...
        </div>
      )}

      {error && (
        <div className="text-center p-4 text-sm text-red-600">
          Error: {error}
        </div>
      )}

      {/* LISTA DE PRODUCTOS */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {filtered.length === 0 && !loading && !error ? (
          <div className="text-center text-gray-500 p-4 text-sm">
            No se encontraron productos para "{query}".
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAdd={handleAddInternal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}