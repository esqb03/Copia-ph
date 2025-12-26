import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import DashboardDesktop from "./components/Dashboard";
import DashboardMobile from "./components/DashboardMov";
import OrderSummary from "./components/OrderSummary";
import Messages from "./components/Messages";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Account from "./components/Account";
import Sidebar from "./components/Sidebar";
import SidebarMov from "./components/SidebarMov";
import NewCustomer from "./pages/NewCustomer";
import NewCustomerMov from "./pages/NewCustomerMov";
import CustomersList from "./pages/CustomersList";
import CustomersListMov from "./pages/CustomersListMov";
import CreateOrder from "./pages/CreateOrder";
import CreateOrderMov from "./pages/CreateOrderMov";
import OrderList from "./pages/OrdersSalesList";
import OrderListMov from "./pages/OrdersSalesListMov";
import LogoLoader from "./components/LogoLoader";
import { Toaster } from "sonner";
import { prefetchProducts, refreshProducts } from "./lib/productCache";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("employee_id"),
  );

  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("last_page") || "dashboard";
  });

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobileOrTablet(window.innerWidth < 1024);
    checkSize();
    window.addEventListener("resize", checkSize);

    const timer = setTimeout(() => setBootLoading(false), 2000);

    return () => {
      window.removeEventListener("resize", checkSize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    prefetchProducts();

    const id = window.setInterval(() => {
      refreshProducts().catch(() => {});
    }, 15 * 60 * 1000);

    return () => {
      window.clearInterval(id);
    };
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    handleNavigate("dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page: string) => {
    setNavLoading(true);
    setCurrentPage(page);
    localStorage.setItem("last_page", page);
    setTimeout(() => setNavLoading(false), 600);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return isMobileOrTablet ? <DashboardMobile /> : <DashboardDesktop />;
      case "order-summary":
        return <OrderSummary />;
      case "messages":
        return <Messages />;
      case "products":
        return (
          <ProductList
            onProductSelect={() => handleNavigate("product-detail")}
          />
        );
      case "product-detail":
        return (
          <ProductDetail onBack={() => handleNavigate("products")} />
        );
      case "new-customer":
        return isMobileOrTablet ? <NewCustomerMov /> : <NewCustomer />;
      case "customers-list":
        return isMobileOrTablet ? (
          <CustomersListMov />
        ) : (
          <CustomersList />
        );
      case "create-order":
        return isMobileOrTablet ? (
          <CreateOrderMov onBack={() => handleNavigate("dashboard")} />
        ) : (
          <CreateOrder onBack={() => handleNavigate("dashboard")} />
        );
      case "order-list":
        return isMobileOrTablet ? <OrderListMov /> : <OrderList />;
      case "account":
        return <Account onLogout={handleLogout} />;
      default:
        return isMobileOrTablet ? <DashboardMobile /> : <DashboardDesktop />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] w-full overflow-x-hidden font-sans">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="flex w-full min-h-screen">
          <div className="hidden lg:block flex-shrink-0">
            <Sidebar
              currentPage={currentPage}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          </div>

          <div className="flex-1 flex flex-col min-w-0 relative">
            <div className={`w-full ${isMobileOrTablet ? "pb-[80px]" : ""}`}>
              <div className="w-full max-w-full min-w-0">
                {renderPage()}
              </div>
            </div>

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

      <LogoLoader
        isOpen={bootLoading || navLoading}
        text={bootLoading ? "Iniciando sistema..." : "Cargando..."}
      />

      <Toaster position="top-center" richColors />
    </div>
  );
}
