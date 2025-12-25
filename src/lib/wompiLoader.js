// src/lib/wompiLoader.js

const WIDGET_SRC = 'https://checkout.wompi.co/widget.js';

/**
 * Carga el script de Wompi una sola vez
 */
export function loadScriptOnce(src = WIDGET_SRC) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();

    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`No se pudo cargar ${src}`));

    document.body.appendChild(s);
  });
}

/**
 * Espera a que el widget esté listo
 */
export async function ensureWompiReady(timeoutMs = 8000) {
  await loadScriptOnce();

  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (window.WidgetCheckout) return;
    if (window.Wompi && typeof window.Wompi.open === 'function') return;

    await new Promise((r) => setTimeout(r, 100));
  }

  throw new Error('Wompi widget no se inicializó a tiempo');
}

/**
 * Abre el widget de Wompi
 */
export async function openWompiUniversal(params) {
  await ensureWompiReady();

  const normalized = {
    currency: params.currency,
    amount_in_cents: params.amount_in_cents ?? params.amountInCents,
    reference: params.reference,
    public_key: params.public_key ?? params.publicKey,
    redirect_url: params.redirect_url ?? params.redirectUrl,
    signature: params.signature,
    customerData: params.customerData || null,
  };

  if (
    !normalized.currency ||
    !normalized.amount_in_cents ||
    !normalized.reference ||
    !normalized.public_key ||
    !normalized.signature
  ) {
    throw new Error('Faltan parámetros obligatorios para abrir Wompi');
  }

  // --- API moderna: WidgetCheckout ---
  if (window.WidgetCheckout) {
    const config = {
      currency: normalized.currency,
      amountInCents: normalized.amount_in_cents,
      reference: normalized.reference,
      publicKey: normalized.public_key,
      redirectUrl: normalized.redirect_url,
      signature: normalized.signature,
    };

    if (normalized.customerData) {
      config.customerData = normalized.customerData;
    }

    const checkout = new window.WidgetCheckout(config);
    checkout.open((result) => {
      console.log('[Wompi] Resultado transacción:', result);
    });

    return;
  }

  // --- API Legacy: window.Wompi.open ---
  if (window.Wompi && typeof window.Wompi.open === 'function') {
    const payload = {
      currency: normalized.currency,
      amount_in_cents: normalized.amount_in_cents,
      reference: normalized.reference,
      public_key: normalized.public_key,
      redirect_url: normalized.redirect_url,
      signature: normalized.signature,
    };

    if (normalized.customerData) {
      payload.customer_data = normalized.customerData;
    }

    window.Wompi.open(payload);
    return;
  }

  throw new Error('No se pudo cargar Wompi');
}

