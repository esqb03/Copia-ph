import React, { useMemo, useState, useEffect } from "react";
import { Plus, Minus, Package } from "lucide-react";

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
  cartQty: number;
  onAdd: (product: ProductBase) => void;
  onDecrease: (product: ProductBase) => void;
}

// --- Helpers ---
function getInitials(name: string) {
  if (!name) return "P";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function resolveImageSrc(image_512?: string) {
  if (!image_512 || typeof image_512 !== "string") return null;
  const trimmed = image_512.trim();
  if (trimmed.length < 20) return null;
  if (trimmed.startsWith("data:image/")) return trimmed;
  return `data:image/png;base64,${trimmed}`;
}

export default function ProductCardMov({ product, cartQty, onAdd, onDecrease }: ProductCardProps) {
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

  const outOfStock = product.qty_available <= 0;
  const showInitials = !imageSrc || imgError;

  return (
    <div className={`p-3 rounded-[20px] shadow-lg border flex items-center gap-4 w-full mb-4 relative overflow-hidden transition-all ${cartQty > 0 ? 'bg-blue-50/30 border-blue-100 shadow-blue-100/50' : 'bg-white shadow-gray-100/50 border-gray-100'}`}>
      
      {/* --- Imagen del Producto --- */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center p-2 relative overflow-hidden">
        {showInitials ? (
          <div className="w-full h-full bg-[#faf6f1] rounded-xl flex items-center justify-center border border-[#eaddcf]">
            <span className="text-2xl font-black text-[#a89076] select-none">{getInitials(product.name)}</span>
          </div>
        ) : (
          <img src={imageSrc!} alt={product.name} className={`w-full h-full object-contain mix-blend-multiply ${outOfStock ? 'grayscale opacity-50' : ''}`} onError={() => setImgError(true)} />
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-10">
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full border border-red-100 shadow-sm">Agotado</span>
          </div>
        )}
      </div>

      {/* --- Información --- */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <h3 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${outOfStock ? 'bg-red-50 text-red-400' : 'bg-[#faf6f1] text-[#a89076]'}`}>
                <Package size={10} strokeWidth={2.5} />
                <span>Disponible: {product.qty_available}</span>
            </span>
            {product.default_code && <span className="text-[9px] text-gray-400 font-medium hidden sm:block">#{product.default_code}</span>}
        </div>
        <p className="text-sm font-black text-green-700 mt-1">{formattedPrice}</p>
      </div>

      {/* --- Controles de Acción --- */}
      <div className="flex flex-col items-center justify-center h-full pl-1">
        {cartQty > 0 ? (
          <div className="flex flex-col items-center bg-[#faf6f1] rounded-xl p-1 gap-1 shadow-inner border border-[#eaddcf]">
            <button onClick={() => onAdd(product)} disabled={outOfStock} className="w-8 h-8 flex items-center justify-center bg-white text-[#a89076] rounded-lg shadow-sm active:scale-90 transition-transform">
              <Plus size={16} strokeWidth={3} />
            </button>
            <span className="text-xs font-black text-[#a89076] py-0.5 min-w-[1.5rem] text-center">{cartQty}</span>
            <button onClick={() => onDecrease(product)} className="w-8 h-8 flex items-center justify-center bg-white text-[#a89076] rounded-lg shadow-sm active:scale-90 transition-transform">
              <Minus size={16} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => !outOfStock && onAdd(product)}
            disabled={outOfStock}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${outOfStock ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-[#a89076] text-white hover:bg-[#8f7a63] hover:shadow-md active:scale-90'}`}
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}