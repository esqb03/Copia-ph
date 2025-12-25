import React, { forwardRef, Ref } from "react";
import {
  Package,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";

type CartItem = any;
type Partner = any;

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(amount || 0);

const getNumericPrice = (item: CartItem): number => {
  if (typeof item.list_price === "number" && item.list_price > 0) {
    return item.list_price;
  }
  if (typeof item.price === "string") {
    const priceString = item.price.replace(/[$,\s]/g, "");
    const numericPrice = parseFloat(priceString);
    return isNaN(numericPrice) ? 0 : numericPrice;
  }
  if (typeof item.price === "number") {
    return item.price;
  }
  return 0;
};

type ExpandedSections = {
  product: boolean;
  delivery: boolean;
  address: boolean;
  payment: boolean;
};

type OrderDetailsLike = {
  orderNumber?: string;
  delivery?: { service?: string };
  address?: string;
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

  orderDetails?: OrderDetailsLike;
}

export default forwardRef(function OrderPanel(
  {
    items,
    onRemove,
    onQtyChange,
    selectedPartner,
    onFinalizeOrder,
    isSubmitting,
    expandedSections,
    toggleSection,
    orderDetails,
  }: OrderPanelProps,
  ref: Ref<HTMLDivElement>
) {
  const subtotal = items.reduce(
    (sum, item) => sum + getNumericPrice(item) * (item.qty || 0),
    0
  );
  const taxes = 0;
  const homeDelivery = 0;
  const grandTotal = subtotal + taxes + homeDelivery;

  const CartItemRow: React.FC<any> = ({ item }) => (
    <div className="flex items-start sm:items-center gap-3 p-3 bg-[#faf8f4] rounded-lg">
      {/* thumbnail */}
      <div className="w-12 h-12 bg-[#a89076] bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
        <div className="w-9 h-9 bg-gray-200 rounded-md" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm truncate" title={item.name}>
          {item.name}
        </h4>
        <p className="text-xs text-gray-500">
          {formatCurrency(getNumericPrice(item))} x {item.qty}
        </p>
      </div>

      {/* controles */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center border border-[#a89076] rounded-md bg-white overflow-hidden self-start sm:self-auto">
          <button
            onClick={() => onQtyChange(item.id, (item.qty || 0) - 1)}
            className="px-2 py-1 text-gray-700 hover:bg-gray-200 text-xs"
          >
            -
          </button>
          <span className="px-2 text-xs font-semibold text-gray-800">
            {item.qty}
          </span>
          <button
            onClick={() => onQtyChange(item.id, (item.qty || 0) + 1)}
            className="px-2 py-1 text-gray-700 hover:bg-gray-200 text-xs"
          >
            +
          </button>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-neutral-900 sm:w-24">
            {formatCurrency(getNumericPrice(item) * (item.qty || 0))}
          </p>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition self-start sm:self-auto"
          aria-label="Remove item"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="
        w-full md:w-96
        md:border-l md:border-gray-200
        overflow-y-auto
      "
    >
      <div className="p-4 sm:p-6 flex flex-col min-h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#faf8f4] rounded-lg flex items-center justify-center">
              <Package size={18} className="text-[#a89076]" />
            </div>
            <h3>Detalle Orden</h3>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-lg">
            <MoreVertical size={18} className="text-gray-400" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4 sm:mb-6">
          Orden de Pedido {orderDetails?.orderNumber ?? ""}
        </p>

        {/* Product */}
        <div className="mb-5 sm:mb-6">
          <button
            onClick={() => toggleSection("product")}
            className="w-full flex items-center justify-between mb-3"
          >
            <span>Productos</span>
            {expandedSections.product ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSections.product && (
            <div className="space-y-3" ref={ref}>
              {items.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  El carrito está vacío.
                </div>
              ) : (
                items.map((item: any) => (
                  <CartItemRow key={item.id} item={item} />
                ))
              )}
            </div>
          )}
        </div>

        {/* Delivery */}
        <div className="mb-5 sm:mb-6">
          <button
            onClick={() => toggleSection("delivery")}
            className="w-full flex items-center justify-between mb-3"
          >
            <span>Envio</span>
            {expandedSections.delivery ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSections.delivery && (
            <div className="flex items-center gap-3 p-3 bg-[#faf8f4] rounded-lg">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white text-xs">📦</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">
                  {orderDetails?.delivery?.service ?? "Envío"}
                </p>
                <p className="text-xs text-gray-500">Entrega a domicilio</p>
              </div>
              <p className="text-sm">{formatCurrency(homeDelivery)}</p>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="mb-5 sm:mb-6">
          <button
            onClick={() => toggleSection("address")}
            className="w-full flex items-center justify-between mb-3"
          >
    
          </button>

    
        </div>

        {/* Payment */}
        <div className="mb-5 sm:mb-6">
          <button
            onClick={() => toggleSection("payment")}
            className="w-full flex items-center justify-between mb-3"
          >
            <span>Pago</span>
            {expandedSections.payment ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSections.payment && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">
                  Subtotal({items.length} product)
                </span>
                <span className="text-right">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Impuestos (0%)</span>
                <span className="text-right">{formatCurrency(taxes)}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Envio</span>
                <span className="text-right">{formatCurrency(homeDelivery)}</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between gap-4">
                <span>Total</span>
                <span className="text-lg text-right">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-auto flex flex-col sm:flex-row gap-2">
          <button
            onClick={onFinalizeOrder}
            disabled={items.length === 0 || !selectedPartner || isSubmitting}
            className="
              w-full sm:flex-1 py-2 rounded-lg
              bg-[#a89076] text-white text-xs font-semibold
              disabled:bg-gray-300 disabled:text-gray-600
              transition hover:bg-[#967d63]
            "
          >
            {isSubmitting ? "Creando Orden..." : "Procesar Pedido"}
          </button>

          <button
            disabled={isSubmitting}
            className="
              w-full sm:flex-1 py-2 rounded-lg
              border border-red-300 text-red-600 text-xs font-semibold
              hover:bg-red-50 transition
              disabled:opacity-60
            "
          >
            Cancelar Orden
          </button>
        </div>
      </div>
    </div>
  );
});
