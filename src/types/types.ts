// src/types/types.ts

/**
 * Interfaz para representar un producto en la aplicación.
 * Derivada de la estructura de datos de Odoo.
 */
export interface Product {
    qty: number; // Cantidad en el carrito (propiedad de la aplicación, no de Odoo)
    qty_available: number; // Stock disponible de Odoo
    id: number | string; // ID del producto
    name: string; // Nombre del producto
    price: number; // Precio base (puede ser list_price o unit_price de Odoo)
    list_price: number; // Precio de lista original (útil para consistencia)
    image_512?: string; // Imagen en formato Base64
    image?: string; // URL de la imagen (alternativa)
    default_code?: string; // Referencia interna
    code?: string;
    description_sale?: string; // Descripción corta
    [key: string]: any; // Permite otras propiedades de Odoo no tipadas explícitamente
}

/**
 * Interfaz para representar un cliente (Partner) de Odoo.
 */
export interface Partner {
    id: number; // ID de Odoo
    name: string; // Nombre del cliente
    email?: string;
    phone?: string;
    // ... cualquier otra propiedad del partner de Odoo
    [key: string]: any; 
}

/**
 * Interfaz para una línea de orden de venta (cart item).
 * Es un producto con su cantidad en el carrito.
 */
export interface CartItem extends Product {}


/**
 * Interfaz para el estado del modal de alerta/confirmación.
 */
export interface ModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText: string;
    isDanger: boolean;
    showCancel: boolean;
}
