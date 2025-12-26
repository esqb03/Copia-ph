const API_URL = import.meta.env.VITE_API_URL;

export interface ProductBase {
  id: number | string;
  name: string;
  list_price?: number;
  price?: number | string;
  image_512?: string;
  qty_available: number;
  default_code?: string;
  description_sale?: string;
  [key: string]: any;
}

let productCache: ProductBase[] | null = null;
let productCachePromise: Promise<ProductBase[]> | null = null;
let lastUpdated: number | null = null;

const TTL_MS = 15 * 60 * 1000;

async function fetchProductsFromServer(): Promise<ProductBase[]> {
  const employeeId = localStorage.getItem("employee_id");
  if (!employeeId) {
    throw new Error("ID de empleado no encontrado. Inicia sesión nuevamente.");
  }

  const res = await fetch(
    `${API_URL}/products?employee_id=${employeeId}&limit=100`,
  );
  if (!res.ok) {
    let msg = `Error HTTP: ${res.status}`;
    try {
      const data = await res.json();
      msg = data.detailedError || data.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Respuesta de productos inválida.");
  }

  return data;
}

export async function ensureProductsLoaded(opts?: {
  force?: boolean;
}): Promise<ProductBase[]> {
  const force = opts?.force === true;

  if (!force && productCache && lastUpdated) {
    const age = Date.now() - lastUpdated;
    if (age < TTL_MS) {
      return productCache;
    }
  }

  if (productCache && !force) {
    return productCache;
  }

  if (productCachePromise) {
    return productCachePromise;
  }

  productCachePromise = fetchProductsFromServer()
    .then((products) => {
      productCache = products;
      lastUpdated = Date.now();
      productCachePromise = null;
      return products;
    })
    .catch((err) => {
      productCachePromise = null;
      throw err;
    });

  return productCachePromise;
}

export function getProductsCache(): ProductBase[] | null {
  return productCache;
}

export async function prefetchProducts(): Promise<void> {
  try {
    await ensureProductsLoaded();
  } catch {}
}

export async function refreshProducts(): Promise<ProductBase[]> {
  return ensureProductsLoaded({ force: true });
}

export function setProductsCache(products: ProductBase[]): void {
  productCache = products;
  lastUpdated = Date.now();
}
