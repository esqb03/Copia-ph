import React, { useRef, useState } from 'react';
import { LayoutDashboard, ShoppingBag, CreditCard, Users, LogOut, FileText } from 'lucide-react';
import MinimalModal from './MinimalModal';

interface SidebarMovProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

type ToggleKey = 'clientes' | 'pedidos' | null;

export default function SidebarMov({ currentPage, onNavigate, onLogout }: SidebarMovProps) {
  const [activeToggle, setActiveToggle] = useState<ToggleKey>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [submenuX, setSubmenuX] = useState<number>(window.innerWidth / 2);

  const clientesBtnRef = useRef<HTMLButtonElement | null>(null);
  const pedidosBtnRef = useRef<HTMLButtonElement | null>(null);

  const customerSubItems = [
    { icon: Users, label: 'Nuevo Cliente', page: 'new-customer' },
    { icon: FileText, label: 'Lista de Clientes', page: 'customers-list' },
  ];

  const ordersSubItems = [
    { icon: CreditCard, label: 'Nuevo Pedido', page: 'create-order' },
    { icon: ShoppingBag, label: 'Lista de Pedidos', page: 'order-list' },
  ];

  const openSubmenuFor = (key: Exclude<ToggleKey, null>) => {
    const ref = key === 'clientes' ? clientesBtnRef.current : pedidosBtnRef.current;
    if (ref) {
      const rect = ref.getBoundingClientRect();
      const safeX = Math.max(110, Math.min(window.innerWidth - 110, rect.left + rect.width / 2));
      setSubmenuX(safeX);
    }
    setActiveToggle(prev => (prev === key ? null : key));
  };

  // Estilo para evitar el "flash" azul o gris al tocar en móviles
  const cleanTouchStyle = { WebkitTapHighlightColor: 'transparent' };

  return (
    <>
      {/* 1. Overlay (Fondo oscuro) */}
      {activeToggle && (
        <div 
          className="fixed inset-0 z-[900] bg-black/10 backdrop-blur-[2px] transition-opacity" 
          onClick={() => setActiveToggle(null)} 
        />
      )}

      {/* 2. Submenú Flotante (CORREGIDO: Sin fantasmas) */}
      <div
        className={`fixed z-[1000] bg-white rounded-2xl transition-all duration-200 ease-out origin-bottom overflow-hidden
          ${activeToggle 
            ? 'opacity-100 translate-y-0 scale-100 visible p-2 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)]' 
            : 'opacity-0 translate-y-4 scale-95 invisible p-0 border-none shadow-none pointer-events-none'
          }`}
        style={{
          left: submenuX,
          transform: `translateX(-50%) ${activeToggle ? 'translateY(0)' : 'translateY(10px)'}`,
          bottom: 'calc(80px + env(safe-area-inset-bottom))',
          width: '200px',
        }}
      >
        {/* El contenido solo se renderiza si está activo para evitar huecos */}
        {activeToggle && (
          <div className="flex flex-col gap-1">
            {(activeToggle === 'clientes' ? customerSubItems : ordersSubItems).map((sub) => (
              <button
                key={sub.page}
                onClick={() => {
                  setActiveToggle(null);
                  onNavigate(sub.page);
                }}
                style={cleanTouchStyle}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all active:scale-95 outline-none focus:outline-none ${
                  currentPage === sub.page 
                    ? 'bg-[#a89076] text-white shadow-md shadow-[#a89076]/20' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <sub.icon size={18} strokeWidth={2} />
                <span className="font-semibold text-sm">{sub.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Barra de Navegación Fija */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-[950] bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom)',
          height: 'calc(65px + env(safe-area-inset-bottom))'
        }}
      >
        <div className="flex justify-around items-center h-full max-w-md mx-auto px-2">
          
          {/* Dashboard */}
          <button 
            onClick={() => { setActiveToggle(null); onNavigate('dashboard'); }} 
            style={cleanTouchStyle}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-transform active:scale-90 outline-none ${
               currentPage === 'dashboard' ? 'text-[#a89076]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <LayoutDashboard size={24} strokeWidth={currentPage === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-bold">Principal</span>
          </button>

          {/* Clientes */}
          <button 
            ref={clientesBtnRef}
            onClick={() => openSubmenuFor('clientes')} 
            style={cleanTouchStyle}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-transform active:scale-90 outline-none ${
               activeToggle === 'clientes' || currentPage.includes('customer') ? 'text-[#a89076]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Users size={24} strokeWidth={activeToggle === 'clientes' || currentPage.includes('customer') ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-bold">Clientes</span>
          </button>

          {/* Pedidos */}
          <button 
            ref={pedidosBtnRef}
            onClick={() => openSubmenuFor('pedidos')} 
            style={cleanTouchStyle}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-transform active:scale-90 outline-none ${
               activeToggle === 'pedidos' || currentPage.includes('order') ? 'text-[#a89076]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ShoppingBag size={24} strokeWidth={activeToggle === 'pedidos' || currentPage.includes('order') ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-bold">Pedidos</span>
          </button>

          {/* Salir */}
          <button 
            onClick={() => { setActiveToggle(null); setShowLogoutModal(true); }} 
            style={cleanTouchStyle}
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-400 hover:text-red-500 transition-transform active:scale-90 outline-none"
          >
            <LogOut size={24} strokeWidth={2} />
            <span className="text-[10px] mt-1 font-bold">Salir</span>
          </button>
        </div>
      </nav>

      <MinimalModal 
        isOpen={showLogoutModal} 
        title="Cerrar sesión" 
        message="¿Deseas salir del sistema?" 
        confirmText="Salir" 
        isDanger showCancel 
        onConfirm={() => { setShowLogoutModal(false); onLogout(); }} 
        onCancel={() => setShowLogoutModal(false)} 
      />
    </>
  );
}