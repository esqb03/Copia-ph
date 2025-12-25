// src/components/MinimalModal.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MinimalModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  isDanger?: boolean;
  showCancel?: boolean;
}

export default function MinimalModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Aceptar',
  isDanger = false, // lo mantenemos por compat, pero ya no usamos rojo
  showCancel = true,
}: MinimalModalProps) {
  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onCancel]);

  // Bloquear scroll del fondo
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 🎨 Colores tomados del Sidebar:
  // Activo: bg-[#a89076] text-white :contentReference[oaicite:3]{index=3}
  const brandBg = '#a89076';
  const brandHover = '#967d63'; // un tono más oscuro para hover (coherente con tu app)
  const modalBg = '#FFFFFF';    // beige sólido que ya te gustó
  const modalBorder = '#d7c6ae';

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay neutro */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
        onClick={onCancel}
      />

      {/* Modal (SIN franja superior) */}
      <div
        className="relative w-full max-w-md rounded-2xl border p-0"
        style={{
          backgroundColor: modalBg,
          borderColor: modalBorder,
          boxShadow:
            '0 20px 45px rgba(0,0,0,0.18), 0 8px 18px rgba(0,0,0,0.10)',
          transform: 'translateZ(0)',
          animation: 'mmFadeScale 160ms ease-out',
        }}
      >
        <div className="p-6">
          {/* Título y mensaje */}
          <div className="mb-5">
            <h3 className="text-lg sm:text-xl font-semibold" style={{ color: '#3b2f23' }}>
              {title}
            </h3>

            <p className="mt-2 text-sm sm:text-base leading-relaxed" style={{ color: '#5b4a39' }}>
              {message}
            </p>
          </div>

          {/* Botones lado a lado */}
          <div className={`grid gap-3 ${showCancel ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {showCancel && (
              <button
                onClick={onCancel}
                className="w-full px-4 py-2.5 rounded-xl border font-semibold transition-colors"
                // Cancelar como “hover:bg-gray-50” del sidebar (suave) :contentReference[oaicite:4]{index=4}
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e7eb',
                  color: '#4b5563', // similar a text-gray-600
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'; // similar a gray-50
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                Cancelar
              </button>
            )}

            <button
              onClick={onConfirm}
              className="w-full px-4 py-2.5 rounded-xl font-semibold text-white transition-colors"
              // Confirmar con el color activo del sidebar :contentReference[oaicite:5]{index=5}
              style={{
                backgroundColor: brandBg,
                boxShadow: '0 10px 20px rgba(168,144,118,0.28)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = brandHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = brandBg;
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>

        {/* Animación */}
        <style>{`
          @keyframes mmFadeScale {
            from { opacity: 0; transform: scale(0.98); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

