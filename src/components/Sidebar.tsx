// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CreditCard, 
  Package, 
  Users,
  FileText,
  LogOut
} from 'lucide-react';
import MinimalModal from './MinimalModal';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 🔥 MODIFICADO: Se elimina el item 'Productos' para que la lista quede vacía.
  const generalItems = [];

  const customerItems = [
    { icon: Users, label: 'Nuevo Cliente', page: 'new-customer' },
    { icon: FileText, label: 'Lista de Clientes', page: 'customers-list' },
  ];

  const ordersItems = [
    { icon: CreditCard, label: 'Nuevo Pedido', page: 'create-order' },
    { icon: ShoppingBag, label: 'Lista de Pedidos', page: 'order-list' },
  ];

  const supportItems = [
    { icon: LogOut, label: 'Salir', page: 'logout' },
  ];

  const renderItem = (item: { label: string; page: string; icon: any }) => {
    const isLogout = item.page === 'logout';

    return (
      <button
        key={item.label}
        onClick={() => {
          if (isLogout) {
            setShowLogoutModal(true);
            return;
          }
          onNavigate(item.page);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
          !isLogout && currentPage === item.page 
            ? 'bg-[#a89076] text-white' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <item.icon size={20} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        {/* LOGO SUPERIOR */}
        <div className="flex flex-col items-center justify-center mb-12">
          <img
            src="/app/logo.svg"
            alt="Company Logo"
            className="w-36 h-auto select-none"
          />
        </div>

        {/* 1. GENERAL */}
        <div className="mb-6"> 
          <p className="text-xs text-gray-400 uppercase mb-4">General</p>

          {/* Botón Principal (se deja fuera del map, como estaba) */}
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
              currentPage === 'dashboard' 
                ? 'bg-[#a89076] text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Principal</span>
          </button>

          {/* generalItems ahora está vacío y no renderiza nada */}
          {generalItems.map(renderItem)}
        </div>

        {/* 2. CLIENTES */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 uppercase mb-4 flex items-center gap-2">
            <Users size={14} className="text-gray-400" /> Clientes
          </p>
          {customerItems.map(renderItem)}
        </div>

        {/* 3. PEDIDOS */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 uppercase mb-4 flex items-center gap-2">
            <CreditCard size={14} className="text-gray-400" /> Pedidos
          </p>
          {ordersItems.map(renderItem)}
        </div>

        {/* 4. SUPPORT */}
        <div className="mt-auto">
          <p className="text-xs text-gray-400 uppercase mb-4">Soporte</p>
          {supportItems.map(renderItem)}
        </div>
      </aside>

      {/* MODAL DE CONFIRMACIÓN DE SALIDA */}
      <MinimalModal
        isOpen={showLogoutModal}
        title="Cerrar sesión"
        message="¿Seguro que deseas salir de la aplicación?"
        confirmText="Salir"
        isDanger={true}
        showCancel={true}
        onConfirm={() => {
          setShowLogoutModal(false);
          onLogout();
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}


