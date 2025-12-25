

// src/components/LogoLoader.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type LogoLoaderProps = {
  isOpen: boolean;
  text?: string;
  // Duración de la salida (ms). Debe coincidir con la animación CSS.
  exitDurationMs?: number;
};

export default function LogoLoader({
  isOpen,
  text,
  exitDurationMs = 280,
}: LogoLoaderProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  // Mantener montado mientras hace fade-out
  useEffect(() => {
    let t: number | undefined;

    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      t = window.setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, exitDurationMs);
    }

    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [isOpen, shouldRender, exitDurationMs]);

  // Bloquear scroll mientras el loader está visible (incluyendo closing)
  useEffect(() => {
    if (!shouldRender) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shouldRender]);

  const overlayStyle = useMemo(
    () => ({
      backgroundColor: 'rgba(255,255,255,0.80)', // overlay MUY sutil
    }),
    []
  );

  if (!shouldRender) return null;

  const node = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center px-4"
      aria-label="Cargando"
      role="status"
    >
      {/* Overlay */}
      <div className="absolute inset-0" style={overlayStyle} />

      {/* Logo (sin caja) */}
      <div
        className="relative flex flex-col items-center"
        style={{
          animation: isClosing ? `loaderOut ${exitDurationMs}ms ease-in both` : undefined,
        }}
      >
        <img
          src="/app/logo.svg"
          alt="Perfume House"
          className={`loader-logo h-12 md:h-24 w-auto select-none ${isClosing ? 'closing' : ''}`}
          draggable={false}
        />

        {text ? (
          <div
            className="mt-3 text-md font-semibold tracking-wide"
            style={{
              color: '#a89076', // beige cálido del tema
              opacity: isClosing ? 0.0 : 1,
              transition: `opacity ${exitDurationMs}ms ease-in`,
            }}
          >
            {text}
          </div>
        ) : null}

        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .loader-logo { animation: none !important; }
          }

          .loader-logo {
            filter: drop-shadow(0 12px 22px rgba(0,0,0,0.14));
            transform-origin: center;
            animation:
              logoIn 520ms ease-out both,
              logoBreath 2.8s ease-in-out 560ms infinite;
          }

          /* Cuando está cerrando, detenemos el "breath" para que salga limpio */
          .loader-logo.closing {
            animation: logoIn 1ms linear both; /* mantiene estable */
          }

          @keyframes logoIn {
            from { opacity: 0; transform: translateY(10px) scale(0.985); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }

          @keyframes logoBreath {
            0%, 100% { transform: scale(1); opacity: 1; }
            50%      { transform: scale(1.015); opacity: 0.98; }
          }

          /* ✅ Salida suave del contenedor completo (logo + texto) */
          @keyframes loaderOut {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to   { opacity: 0; transform: translateY(6px) scale(0.985); }
          }
        `}</style>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

