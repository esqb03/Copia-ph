// App.tsx
import React, { useState, useEffect, useRef } from 'react';
import Login from './pages/Login';
import DashboardDesktop from './components/Dashboard';
import DashboardMobile from './components/DashboardMov';
import OrderSummary from './components/OrderSummary';
import Messages from './components/Messages';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Account from './components/Account';
import Sidebar from './components/Sidebar';
import SidebarMov from './components/SidebarMov';
import NewCustomer from './pages/NewCustomer';
import NewCustomerMov from './pages/NewCustomerMov';
import CustomersList from './pages/CustomersList';
import CustomersListMov from './pages/CustomersListMov';
import CreateOrder from './pages/CreateOrder';
import CreateOrderMov from './pages/CreateOrderMov';
import OrderList from './pages/OrdersSalesList';
import OrderListMov from './pages/OrdersSalesListMov';
import LogoLoader from './components/LogoLoader';
import MinimalModal from './components/MinimalModal';
import { Toaster } from 'sonner'; // <--- IMPORTANTE: Importar el notificador

const INACTIVITY_LIMIT = 450_000; // 7.5 min
const WARNING_TIME = 420_000;    // 7 min
const COUNTDOWN_SECONDS = 30;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('employee_id'));
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);

  // Estados de Inactividad
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);

  // --- Lógica de Responsive y Carga Inicial ---
  useEffect(() => {
    const checkSize = () => setIsMobileOrTablet(window.innerWidth < 1024);
    checkSize();
    window.addEventListener('resize', checkSize);
    
    // Simular carga inicial del sistema
    const timer = setTimeout(() => setBootLoading(false), 2000);
    
    return () => {
      window.removeEventListener('resize', checkSize);
      clearTimeout(timer);
    };
  }, []);

  // --- Lógica de Inactividad ---
  const resetTimers = () => {
    setShowInactivityModal(false);
    setCountdown(COUNTDOWN_SECONDS);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    if (isLoggedIn) {
      timerRef.current = setTimeout(() => {
        setShowInactivityModal(true);
        startCountdown();
      }, WARNING_TIME);
    }
  };

  const startCountdown = () => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isLoggedIn) {
      window.addEventListener('mousemove', resetTimers);
      window.addEventListener('keydown', resetTimers);
      window.addEventListener('touchstart', resetTimers); // Para móviles
      resetTimers();
    }
    return () => {
      window.removeEventListener('mousemove', resetTimers);
      window.removeEventListener('keydown', resetTimers);
      window.removeEventListener('touchstart', resetTimers);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isLoggedIn]);

  // --- Handlers ---
  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('employee_id');
    localStorage.removeItem('employee_name');
    setIsLoggedIn(false);
    setShowInactivityModal(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setNavLoading(true);
    setCurrentPage(page);
    // Simular pequeña transición de carga entre páginas
    setTimeout(() => setNavLoading(false), 600);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return isMobileOrTablet ? <DashboardMobile /> : <DashboardDesktop />;
      case 'order-summary':
        return <OrderSummary />;
      case 'messages':
        return <Messages />;
      case 'products':
        return <ProductList onProductSelect={() => setCurrentPage('product-detail')} />;
      case 'product-detail':
        return <ProductDetail onBack={() => setCurrentPage('products')} />;
      case 'new-customer':
        return isMobileOrTablet ? <NewCustomerMov /> : <NewCustomer />;
      case 'customers-list':
        return isMobileOrTablet ? <CustomersListMov /> : <CustomersList />;
      case 'create-order':
        return isMobileOrTablet 
          ? <CreateOrderMov onBack={() => handleNavigate('dashboard')} /> 
          : <CreateOrder onBack={() => handleNavigate('dashboard')} />;
      case 'order-list':
        return isMobileOrTablet ? <OrderListMov /> : <OrderList />;
      case 'account':
        return <Account onLogout={handleLogout} />;
      default:
        return isMobileOrTablet ? <DashboardMobile /> : <DashboardDesktop />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#f5f1e8] w-full overflow-x-hidden">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="flex h-[100dvh] w-full overflow-hidden">
          
          {/* Sidebar Desktop */}
          <div className="hidden lg:block h-full flex-shrink-0">
            <Sidebar 
              currentPage={currentPage} 
              onNavigate={handleNavigate} 
              onLogout={handleLogout} 
            />
          </div>

          {/* Área de Contenido Principal corregida para ancho móvil */}
          <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
            
            {/* Contenedor de scroll con corrección de padding inferior para el TabBar móvil */}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden w-full ${isMobileOrTablet ? 'pb-[80px]' : ''}`}>
              <div className="w-full max-w-full min-w-0">
                {renderPage()}
              </div>
            </div>
            
            {/* Sidebar Móvil (Tab Bar inferior) */}
            {isMobileOrTablet && (
              <SidebarMov 
                currentPage={currentPage} 
                onNavigate={handleNavigate} 
                onLogout={handleLogout} 
              />
            )}
          </div>
        </div>
      )}

      {/* Loaders Globales */}
      <LogoLoader 
        isOpen={bootLoading || navLoading} 
        text={bootLoading ? 'Iniciando sistema...' : 'Cargando...'} 
      />
      
      {/* Modal de Advertencia de Inactividad */}
      <MinimalModal 
        isOpen={showInactivityModal} 
        title="Sesión por expirar" 
        message={`Tu sesión se cerrará automáticamente en ${countdown} segundos debido a la inactividad detectada.`} 
        confirmText="Seguir conectado"
        onConfirm={resetTimers}
        onCancel={handleLogout}
      />

      {/* IMPORTANTE: El Toaster debe estar aquí para que funcionen las alertas */}
      <Toaster position="top-center" richColors />
    </div>
  );
}