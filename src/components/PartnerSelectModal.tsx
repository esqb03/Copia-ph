// src/components/PartnerSelectModal.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User } from 'lucide-react';
import PartnerSearchInput from './PartnerSearchInput';
import type { Partner } from '../types/types';

interface PartnerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartnerSelect: (partner: Partner | null) => void;
  initialPartner: Partner | null;
}

const PartnerSelectModal: React.FC<PartnerSelectModalProps> = ({
  isOpen,
  onClose,
  onPartnerSelect,
  initialPartner,
}) => {
  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

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

  // 🎨 Paleta de colores
  const brandBg = '#a89076';
  const modalBg = '#FFFFFF';
  const modalBorder = '#d7c6ae';

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay un poco más oscuro para resaltar el modal */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onClick={onClose}
      />

      {/* Contenedor del Modal */}
      <div
        className="relative flex flex-col bg-white border"
        style={{
          width: '100%',
          maxWidth: 500,        // Ancho máximo contenido
          height: '80vh',       // ✅ CLAVE: Ocupa el 80% de la altura de la pantalla (estilo móvil)
          maxHeight: 700,       // Límite en pantallas muy grandes
          borderRadius: 20,
          borderColor: modalBorder,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          transform: 'translateZ(0)',
          animation: 'mmFadeScale 200ms ease-out',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${modalBorder}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#efe2d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={20} style={{ color: brandBg }} />
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: '#3b2f23',
              }}
            >
              Buscar cliente
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full transition-colors bg-gray-50 hover:bg-gray-100"
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5b4a39',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido (Cuerpo) */}
        {/* ✅ Flex-1 y overflow-hidden permiten que PartnerSearchInput maneje su propio scroll */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <PartnerSearchInput
            initialPartner={initialPartner}
            onPartnerSelect={(partner: Partner | null) => {
              onPartnerSelect(partner);
              if (partner) onClose();
            }}
          />
        </div>

        {/* Animación de entrada */}
        <style>{`
          @keyframes mmFadeScale {
            from { opacity: 0; transform: scale(0.96) translateY(10px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default PartnerSelectModal;