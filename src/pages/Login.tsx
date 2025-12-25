// src/pages/Login.tsx
import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import DashboardPreview from '../components/DashboardPreview';
import LogoLoader from '../components/LogoLoader';

const API_URL = import.meta.env.VITE_API_URL;

interface LoginProps {
  onLogin?: () => void;
}

const LoadingSpinner: React.FC = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Por favor, introduce tu email y contraseña.');
      return;
    }

    setIsLoading(true);

    let loginSuccess = false;

    try {
      const response = await fetch(`${API_URL}/external-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        loginSuccess = true;

        localStorage.setItem('employee_id', data.employee_id);
        localStorage.setItem('name', data.name);

        // ✅ Mantener el loader visible antes de mostrar Dashboard
        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (onLogin) onLogin();
        else window.location.href = '/dashboard';
      } else {
        setErrorMessage(
          data.message || 'Error de autenticación. Credenciales no encontradas.'
        );
      }
    } catch (err) {
      console.error('Error al conectar con el servidor:', err);
      setErrorMessage('No se pudo conectar al servidor de Odoo. Intente más tarde.');
    } finally {
      // ✅ Solo quitar loader si NO fue login exitoso
      if (!loginSuccess) setIsLoading(false);
    }
  };

  const cardTransitionClasses = `
    transition-all duration-700 ease-out
    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
  `;

  const buttonTransitionClasses = `
    w-full h-12 flex justify-center items-center
    text-white font-medium text-lg rounded-xl shadow-lg
    focus:outline-none focus:ring-4 focus:ring-[#e7dccb]
    transform transition-all duration-150 ease-in-out
    ${isLoading ? 'bg-gray-700' : 'bg-[#a89076] hover:bg-[#967d63] active:scale-[0.98]'}
  `;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#f5f1e8]">
      {/* Mantener 2 columnas */}
      <div className="w-full max-w-7xl flex items-center justify-between gap-12">
        {/* Columna izquierda */}
        <div className="w-full max-w-md mx-auto lg:mx-0 flex justify-center lg:justify-start">
          {/* Card / formulario */}
          <div
            className={`
              w-full
              rounded-[28px]
              shadow-2xl
              border
              p-8 md:p-10
              ${cardTransitionClasses}
            `}
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#e7dccb',
            }}
          >
            {/* Logo + título */}
            <div className="mb-8 flex flex-col items-center sm:items-start">
              <div className="mb-6 flex justify-center sm:justify-start">
                <img
                  src="/app/logo.svg"
                  alt="Perfume House"
                  className="h-8 md:h-24 w-auto select-none"
                  style={{
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.12))',
                  }}
                  draggable={false}
                />
              </div>

              <h1
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{
                  color: '#a89076',
                  letterSpacing: '-0.02em',
                }}
              >
                Gestion de Pedidos
              </h1>

              <p className="mt-2 text-sm" style={{ color: '#6b5a45' }}>
                Inicia sesión para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm" style={{ color: '#5b4a39' }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none"
                  style={{
                    backgroundColor: '#faf8f4',
                    borderColor: '#e8e4db',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#a89076')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e8e4db')}
                  placeholder="tucorreo@ejemplo.com"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm" style={{ color: '#5b4a39' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none pr-11"
                    style={{
                      backgroundColor: '#faf8f4',
                      borderColor: '#e8e4db',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#a89076')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e8e4db')}
                    placeholder="Tu contraseña"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#5b4a39' }}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="text-sm text-center" style={{ color: '#dc2626' }}>
                  {errorMessage}
                </p>
              )}

              <div className="text-right">
                <a href="#" className="text-sm hover:underline" style={{ color: '#5b4a39' }}>
                  Olvidaste Contraseña?
                </a>
              </div>

              <button type="submit" className={buttonTransitionClasses} disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : 'Sign in'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm" style={{ color: '#5b4a39' }}>
              No tienes una Cuenta?{' '}
              <a href="#" className="hover:underline" style={{ color: '#a89076' }}>
                Crea una cuenta
              </a>
            </p>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="hidden lg:block flex-1">
          <DashboardPreview />
        </div>
      </div>

      {/* ✅ Loader con logo al presionar Sign in */}
      <LogoLoader isOpen={isLoading} text="Cargando ..." />
    </div>
  );
};

export default Login;


