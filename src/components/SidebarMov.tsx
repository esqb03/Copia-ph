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
  // El estado inicial es NULL (Cerrado)
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
      const safeX = Math.max(132, Math.min(window.innerWidth - 132, rect.left + rect.width / 2));
      setSubmenuX(safeX);
    }
    // Si tocas el mismo botón, se cierra. Si tocas otro, se cambia.
    setActiveToggle(prev => (prev === key ? null : key));
  };

  return (
    <>
      {/* 1. Overlay: Solo existe cuando hay un menú abierto */}
      {activeToggle && (
        <div 
          className="fixed inset-0 z-[80] bg-black/5 backdrop-blur-[1px]" 
          onClick={() => setActiveToggle(null)} 
        />
      )}

      {/* 2. Submenú Flotante: Controlado por activeToggle */}
      <div
        className={`fixed z-[90] bg-white border border-gray-100 shadow-2xl rounded-2xl p-1.5 transition-all duration-300 ease-in-out
          ${activeToggle 
            ? 'opacity-100 translate-y-0 scale-100 visible' 
            : 'opacity-0 translate-y-10 scale-90 invisible pointer-events-none'
          }`}
        style={{
          left: submenuX,
          transform: 'translateX(-50%)',
          bottom: 'calc(76px + env(safe-area-inset-bottom))',
          width: '210px',
        }}
      >
        {/* Flechita decorativa */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
        
        <div className="flex flex-col gap-0.5">
          {activeToggle && (activeToggle === 'clientes' ? customerSubItems : ordersSubItems).map((sub) => (
            <button
              key={sub.page}
              onClick={() => {
                setActiveToggle(null);
                onNavigate(sub.page);
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-left transition-colors ${
                currentPage === sub.page ? 'bg-[#a89076] text-white' : 'text-gray-700 active:bg-gray-50'
              }`}
            >
              <sub.icon size={16} />
              <span className="font-medium text-[13px]">{sub.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Barra de Navegación Fija */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom)',
          height: 'calc(64px + env(safe-area-inset-bottom))'
        }}
      >
        <div className="flex justify-around items-center h-[64px] max-w-md mx-auto">
          {/* Dashboard */}
          <button 
            onClick={() => { setActiveToggle(null); onNavigate('dashboard'); }} 
            className="flex flex-col items-center justify-center flex-1"
          >
            <LayoutDashboard size={22} className={currentPage === 'dashboard' ? 'text-[#a89076]' : 'text-gray-400'} />
            <span className={`text-[10px] mt-1 ${currentPage === 'dashboard' ? 'text-[#a89076] font-bold' : 'text-gray-500'}`}>Principal</span>
          </button>

          {/* Clientes */}
          <button 
            ref={clientesBtnRef}
            onClick={() => openSubmenuFor('clientes')} 
            className="flex flex-col items-center justify-center flex-1"
          >
            <Users size={22} className={activeToggle === 'clientes' || currentPage.includes('customer') ? 'text-[#a89076]' : 'text-gray-400'} />
            <span className={`text-[10px] mt-1 ${activeToggle === 'clientes' || currentPage.includes('customer') ? 'text-[#a89076] font-bold' : 'text-gray-500'}`}>Clientes</span>
          </button>

          {/* Pedidos */}
          <button 
            ref={pedidosBtnRef}
            onClick={() => openSubmenuFor('pedidos')} 
            className="flex flex-col items-center justify-center flex-1"
          >
            <ShoppingBag size={22} className={activeToggle === 'pedidos' || currentPage.includes('order') ? 'text-[#a89076]' : 'text-gray-400'} />
            <span className={`text-[10px] mt-1 ${activeToggle === 'pedidos' || currentPage.includes('order') ? 'text-[#a89076] font-bold' : 'text-gray-500'}`}>Pedidos</span>
          </button>

          {/* Salir */}
          <button 
            onClick={() => { setActiveToggle(null); setShowLogoutModal(true); }} 
            className="flex flex-col items-center justify-center flex-1"
          >
            <LogOut size={22} className="text-gray-400" />
            <span className="text-[10px] mt-1 text-gray-500">Salir</span>
          </button>
        </div>
      </nav>

      <MinimalModal 
        isOpen={showLogoutModal} 
        title="Cerrar sesión" 
        message="¿Deseas salir?" 
        confirmText="Salir" 
        isDanger showCancel 
        onConfirm={() => { setShowLogoutModal(false); onLogout(); }} 
        onCancel={() => setShowLogoutModal(false)} 
      />
    </>
  );
}