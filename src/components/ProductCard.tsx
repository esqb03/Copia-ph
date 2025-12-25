// src/components/ProductCard.tsx
import React from 'react';
import { Plus, AlertCircle } from 'lucide-react';
// 👇 CORREGIDO: Importamos desde tu ubicación real en 'ui/utils'
import { cn } from "./ui/utils"; 

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
  onAdd: (product: ProductBase) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  // --- LÓGICA DE DATOS ---
  const hasValidImage =
    product.image_512 &&
    typeof product.image_512 === "string" &&
    product.image_512.trim().length > 20;

  const imageSrc = hasValidImage
    ? `data:image/png;base64,${product.image_512}`
    : "/app/default-image.png";

  const price =
    typeof product.list_price === "number" && product.list_price > 0
      ? product.list_price
      : product.price || 0;

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

  const stock = product.qty_available ?? 0;
  const outOfStock = stock <= 0;
  const lowStock = stock > 0 && stock <= 3;

  // --- RENDERIZADO ---
  return (
    <div
      className="
        group relative w-full
        flex flex-col gap-3
        p-3 rounded-xl
        border border-[#e7dccb] 
        bg-[#faf6f1] hover:bg-white
        transition-all duration-200 ease-out
        hover:shadow-[0_4px_12px_rgba(168,144,118,0.15)]
        hover:border-[#a89076]
      "
    >
      {/* SECCIÓN SUPERIOR: INFO + IMAGEN */}
      <div className="flex justify-between items-start gap-3">
        
        {/* Lado Izquierdo: Información */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {product.default_code && (
            <span className="text-[10px] font-bold tracking-wider text-[#a89076] uppercase">
              {product.default_code}
            </span>
          )}
          
          <h3 
            className="text-xs font-medium text-[#5b4a39] leading-tight line-clamp-2 min-h-[2.5em]" 
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="mt-1 text-sm font-bold text-[#3d3226]">
            {formattedPrice}
          </div>
        </div>

        {/* Lado Derecho: Imagen + Badge Stock */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative w-12 h-12 rounded-lg bg-white border border-[#e7dccb]/60 flex items-center justify-center overflow-hidden p-1 shadow-inner">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-contain transition-transform group-hover:scale-110 duration-300"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/default-image.png";
              }}
            />
          </div>
          
          {/* Badge de Stock Compacto */}
          <div
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border",
              outOfStock
                ? "bg-red-50 text-red-600 border-red-100"
                : lowStock
                ? "bg-amber-50 text-amber-600 border-amber-100"
                : "bg-emerald-50 text-emerald-600 border-emerald-100"
            )}
          >
            {outOfStock ? (
              <>Sin Stock</>
            ) : (
              <>
               {lowStock && <AlertCircle size={8} />} Stock: {stock}
              </>
            )}
          </div>
        </div>
      </div>

      {/* BOTÓN DE ACCIÓN */}
      <button
        onClick={() => !outOfStock && onAdd(product)}
        disabled={outOfStock}
        className={cn(
          "w-full py-2 px-3 rounded-lg text-[11px] font-semibold tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-1.5",
          outOfStock
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            : "bg-[#a89076] text-white hover:bg-[#8c7862] hover:shadow-md active:scale-[0.98] active:bg-[#7a6855]"
        )}
      >
        {outOfStock ? (
          "Agotado"
        ) : (
          <>
            <Plus size={12} strokeWidth={3} />
            {lowStock ? "Últimas Unidades" : "Agregar"}
          </>
        )}
      </button>
    </div>
  );
}