import React, { useMemo, useState, useEffect } from "react";
import { Plus, Minus, Package, Trash2 } from "lucide-react";

interface ProductBase {
  id: number | string;
  name: string;
  list_price: number;
  price: number;
  image_512?: string;
  qty_available: number;
  default_code?: string;
}

interface ProductCardProps {
  product: ProductBase;
  cartQty: number; // Asegúrate de pasar la cantidad desde el padre
  onAdd: (product: ProductBase) => void;
  onDecrease: (product: ProductBase) => void;
}

function resolveImageSrc(image_512?: string) {
  if (!image_512 || typeof image_512 !== "string") return null;
  const trimmed = image_512.trim();
  if (trimmed.length < 20) return null;
  if (trimmed.startsWith("data:image/")) return trimmed;
  return `data:image/png;base64,${trimmed}`;
}

export default function ProductCard({ product, cartQty, onAdd, onDecrease }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = useMemo(() => resolveImageSrc(product.image_512), [product.image_512]);

  useEffect(() => { setImgError(false); }, [product.id]);

  const price = useMemo(() => {
    const lp = Number(product.list_price);
    const p = Number(product.price);
    return (Number.isFinite(lp) && lp > 0) ? lp : (Number.isFinite(p) && p > 0 ? p : 0);
  }, [product.list_price, product.price]);

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(price);
  }, [price]);

  const isLastItem = cartQty === 1;

  return (
    <div className={`relative flex flex-col bg-white rounded-2xl border transition-all p-3 ${cartQty > 0 ? 'border-[#a89076] shadow-md' : 'border-gray-100 shadow-sm'}`}>
      
      {/* Contenedor de Imagen */}
      <div className="aspect-square w-full bg-gray-50 rounded-xl mb-3 flex items-center justify-center p-2 overflow-hidden border border-gray-50">
        {!imageSrc || imgError ? (
          <Package size={32} className="text-gray-300" />
        ) : (
          <img 
            src={imageSrc} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply" 
            onError={() => setImgError(true)} 
          />
        )}
      </div>

      {/* Información */}
      <div className="flex-1 flex flex-col gap-1 mb-2">
        <h3 className="text-xs font-bold text-gray-800 line-clamp-2 min-h-[2rem]">{product.name}</h3>
        <p className="text-sm font-black text-[#a89076]">{formattedPrice}</p>
      </div>

      {/* Footer con Píldora de Control */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-gray-50">
        <div className="flex-1">
            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-tighter">Stock</span>
            <span className="text-xs font-bold text-gray-700">{product.qty_available}</span>
        </div>

        {cartQty > 0 ? (
          <div className="flex items-center bg-[#faf6f1] rounded-full p-1 border border-[#eaddcf] shadow-sm">
            <button 
              onClick={() => onDecrease(product)}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-all active:scale-90 ${
                isLastItem ? "bg-red-50 text-red-500" : "bg-white text-[#a89076]"
              }`}
            >
              {isLastItem ? <Trash2 size={14} /> : <Minus size={14} strokeWidth={3} />}
            </button>
            <span className="min-w-[1.5rem] text-center text-xs font-black text-[#a89076] tabular-nums">{cartQty}</span>
            <button 
              onClick={() => onAdd(product)}
              className="w-7 h-7 flex items-center justify-center bg-white text-[#a89076] rounded-full active:scale-90 transition-transform shadow-sm"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAdd(product)}
            className="w-9 h-9 flex items-center justify-center bg-[#a89076] text-white rounded-full shadow-md active:scale-95 transition-all hover:bg-[#967d63]"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}