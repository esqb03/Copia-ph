import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, RefreshCw, ArrowLeft, Check } from "lucide-react";
import ProductCardMov from "./ProductCardMov";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

// --- Interfaces ---
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
  onDecrease: (product: ProductBase) => void;
  cart: any[];
  onClose?: () => void;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}

export default function ProductSearchCardMov({ onAdd, onDecrease, cart, onClose, setModalState }: ProductSearchCardProps) {
  const [products, setProducts] = useState<ProductBase[]>([]);
  const [filtered, setFiltered] = useState<ProductBase[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // REFERENCIA PARA EL INPUT (Para el Auto-Focus)
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Auto-Focus al abrir ---
  useEffect(() => {
    // Pequeño timeout para asegurar que la animación del modal termine antes de llamar al teclado
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 150); 
    return () => clearTimeout(timer);
  }, []);

  // --- Filtro Local ---
  useEffect(() => {
    if (query.trim() === "") { setFiltered(products); return; }
    const q = query.toLowerCase();
    setFiltered(products.filter((p) => (p.name || "").toLowerCase().includes(q) || ((p.default_code || "").toLowerCase().includes(q))));
  }, [query, products]);

  // --- Carga de Datos ---
  const fetchProducts = useCallback(async () => {
    setLoading(true); setError(null);
    const employeeId = localStorage.getItem("employee_id");
    if (!employeeId) { setError("ID de empleado no encontrado."); setLoading(false); return; }

    try {
      const response = await fetch(`${API_URL}/products?employee_id=${employeeId}&limit=100`);
      if (!response.ok) throw new Error("Error al obtener productos");
      const result = await response.json();
      if (Array.isArray(result)) { setProducts(result); setFiltered(result); }
    } catch (err: any) { console.error(err); setError("Falló la conexión."); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // --- Handlers Internos ---
  const handleAddInternal = (product: ProductBase) => {
    if (product.qty_available <= 0) {
      setModalState({ isOpen: true, title: "⚠️ Sin Stock", message: `El producto "${product.name}" no tiene unidades disponibles.`, onConfirm: () => setModalState((p) => ({ ...p, isOpen: false })), onCancel: () => setModalState((p) => ({ ...p, isOpen: false })), confirmText: "Entendido", isDanger: false, showCancel: false });
      return; 
    }
    onAdd(product);
    // Hacemos el toast un poco más rápido para no estorbar
    toast.success(`${product.name} agregado`, { description: "Cantidad actualizada", duration: 800, position: "top-center", icon: <Check size={16} className="text-green-500" /> });
    
    // Opcional: Mantener el foco en el input después de agregar por si quiere buscar otro rápido
    // inputRef.current?.focus(); 
  };

  const handleDecreaseInternal = (product: ProductBase) => {
    onDecrease(product);
  };

  // --- Render ---
  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        {onClose && ( <button onClick={onClose} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full"> <ArrowLeft size={20} /> </button> )}
        <h2 className="text-lg font-bold text-gray-800 flex-1">Productos</h2>
        {onClose && ( <button onClick={onClose} className="text-sm font-bold text-[#a89076] px-3 py-1.5 bg-[#faf6f1] rounded-lg active:scale-95 transition"> Listo </button> )}
      </div>

      {/* Buscador */}
      <div className="p-3 bg-white">
        <div className="flex items-center w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 focus-within:border-[#a89076] focus-within:ring-1 focus-within:ring-[#a89076] transition-all">
          <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
          <input 
            ref={inputRef} // <--- REFERENCIA CONECTADA AQUÍ
            type="text" 
            placeholder="Buscar..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            className="bg-transparent border-none p-0 w-full text-sm text-gray-800 placeholder:text-gray-400 focus:ring-0 outline-none" 
            disabled={loading} 
          />
        </div>
      </div>

      {/* Estados */}
      {loading && ( <div className="p-4 text-center text-[#a89076] text-sm flex items-center justify-center gap-2"> <RefreshCw className="w-4 h-4 animate-spin" /> Cargando catálogo... </div> )}
      {error && ( <div className="m-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center"> {error} <button onClick={fetchProducts} className="ml-2 font-bold underline">Reintentar</button> </div> )}

      {/* Lista de Productos */}
      <div className="flex-1 overflow-y-auto px-2 pb-20">
        {filtered.length === 0 && !loading && !error ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm"> <Search size={32} className="mb-2 opacity-20" /> <p>No encontramos productos.</p> </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((product) => {
              const inCart = cart.find((item) => item.id === product.id);
              const qty = inCart ? inCart.qty : 0;
              return (
                <ProductCardMov 
                  key={product.id} 
                  product={product}
                  cartQty={qty}
                  onAdd={handleAddInternal} 
                  onDecrease={handleDecreaseInternal}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}