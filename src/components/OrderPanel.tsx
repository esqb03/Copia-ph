import React, { useMemo, forwardRef, useState } from "react";
import { Package, Trash2, Plus, Minus } from "lucide-react";

type CartItem = any;
type Partner = any;

type ExpandedSections = {
  product: boolean;
  delivery: boolean;
  address: boolean;
  payment: boolean;
};

interface OrderPanelProps {
  items: CartItem[];
  onRemove: (productId: number | string) => void;
  onQtyChange: (productId: number | string, newQty: number) => void;
  selectedPartner: Partner | null;
  onFinalizeOrder: () => void;
  isSubmitting: boolean;
  expandedSections: ExpandedSections;
  toggleSection: (section: keyof ExpandedSections) => void;
  onAddProductsClick?: () => void;
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount || 0);

const getNumericPrice = (item: CartItem): number => {
  if (typeof item.list_price === "number" && item.list_price > 0) return item.list_price;
  if (typeof item.price === "string") {
    const priceString = item.price.replace(/[$,\s]/g, "");
    const numericPrice = parseFloat(priceString);
    return isNaN(numericPrice) ? 0 : numericPrice;
  }
  if (typeof item.price === "number") return item.price;
  return 0;
};

function getProductImage(item: any): string | null {
  const imgField =
    item.image_512 ||
    item.image_1920 ||
    item.image_1024 ||
    item.image_256 ||
    item.image_128;
  if (!imgField || typeof imgField !== "string") return null;
  const trimmed = imgField.trim();
  if (trimmed.length < 20) return null;
  if (trimmed.startsWith("data:image/")) return trimmed;
  return `data:image/png;base64,${trimmed}`;
}

const ProductImage = ({ item }: { item: any }) => {
  const [error, setError] = useState(false);
  const src = getProductImage(item);

  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
        <Package size={24} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={item.name}
      className="w-full h-full object-contain mix-blend-multiply"
      onError={() => setError(true)}
    />
  );
};

const OrderPanel = forwardRef<HTMLDivElement, OrderPanelProps>((props, ref) => {
  const { items, onRemove, onQtyChange, onFinalizeOrder, isSubmitting, onAddProductsClick } =
    props;

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + getNumericPrice(item) * (item.qty || 0), 0),
    [items],
  );

  const grandTotal = subtotal;

  return (
    <div ref={ref} className="bg-[#f8f9fa]">
      <div className="pt-3 sm:pt-4 pb-4 space-y-4">
        <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#faf6f0] rounded-full flex items-center justify-center border border-[#eaddcf]">
                <Package className="w-4 h-4 text-[#a89076]" />
              </div>
              <h3 className="text-sm font-bold text-gray-700">Productos</h3>
            </div>
            {onAddProductsClick && (
              <button
                onClick={onAddProductsClick}
                className="text-xs font-bold text-[#a89076] hover:text-[#8f7a63] bg-white border border-[#a89076]/30 px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Agregar
              </button>
            )}
          </div>

          <div className="px-2 sm:px-3 pb-2">
            {items.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center gap-2 text-gray-300">
                <Package size={40} strokeWidth={1} />
                <span className="text-sm font-medium">No hay productos en la orden</span>
              </div>
            ) : (
              items.map((item: any) => {
                const unitPrice = getNumericPrice(item);
                const lineTotal = unitPrice * (item.qty || 0);
                const isLastItem = item.qty === 1;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 sm:gap-4 py-4 border-b border-gray-50 last:border-0 items-center"
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 p-1 border border-gray-50 overflow-hidden ml-1">
                      <ProductImage item={item} />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                      <h4
                        className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight"
                        title={item.name}
                      >
                        {item.name}
                      </h4>
                      <div className="text-sm font-black text-[#a89076]">
                        {formatCurrency(lineTotal)}
                      </div>
                    </div>

                    <div className="flex-shrink-0 mr-1">
                      <div className="flex flex-col items-center justify-between bg-[#faf6f1] rounded-full w-12 py-1.5 border border-[#eaddcf] shadow-sm">
                        <button
                          onClick={() => onQtyChange(item.id, (item.qty || 0) + 1)}
                          className="w-full h-10 flex items-center justify-center text-[#a89076] hover:bg-[#a89076] hover:text-white rounded-full transition-colors active:scale-95"
                        >
                          <Plus size={18} strokeWidth={3} />
                        </button>

                        <span className="w-full flex items-center justify-center text-sm font-black text-[#a89076] select-none tabular-nums py-1">
                          {item.qty}
                        </span>

                        <button
                          onClick={() =>
                            isLastItem ? onRemove(item.id) : onQtyChange(item.id, item.qty - 1)
                          }
                          className={`w-full h-10 flex items-center justify-center rounded-full transition-colors active:scale-95 ${
                            isLastItem
                              ? "text-red-500 hover:bg-red-50"
                              : "text-[#a89076] hover:bg-[#a89076] hover:text-white"
                          }`}
                        >
                          {isLastItem ? (
                            <Trash2 size={18} />
                          ) : (
                            <Minus size={18} strokeWidth={3} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {items.length > 0 && (
          <div className="bg-white rounded-[24px] shadow-sm p-6 flex flex-col items-center justify-center gap-2 mt-2">
            <span className="text-xs font-semibold text-gray-500 tracking-wide">
              TOTAL A PAGAR
            </span>
            <span className="text-3xl font-bold text-gray-900 tracking-tight">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-white pb-6 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (items.length > 0) {
                items.forEach((i) => onRemove(i.id));
              }
            }}
            disabled={isSubmitting || items.length === 0}
            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95 disabled:opacity-0 border-none outline-none"
            title="Vaciar carrito"
          >
            <Trash2 size={26} strokeWidth={1.5} />
          </button>

          <button
            onClick={onFinalizeOrder}
            disabled={isSubmitting || items.length === 0}
            className={`flex-1 py-2 rounded-xl font-extrabold text-base tracking-wide shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              isSubmitting || items.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-[#a89076] text-white shadow-[#a89076]/30 hover:bg-[#967d63]"
            }`}
          >
            {isSubmitting ? "Procesando..." : "PROCESAR PEDIDO"}
          </button>
        </div>
      </div>
    </div>
  );
});

export default OrderPanel;
