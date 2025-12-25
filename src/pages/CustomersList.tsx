import React, { useState, useEffect, useCallback } from 'react';
import { 
    Bell, 
    Search, 
    Download, 
    RefreshCw, 
    Users,
    ArrowLeft
} from 'lucide-react';

// URL de la API (tomada de server.js)
const API_URL = import.meta.env.VITE_API_URL;

// ----------------------------------------------
// Interfaces de Datos
// ----------------------------------------------
// ✅ CORRECCIÓN 1: Interfaz actualizada para coincidir con los campos 
// ['id', 'name', 'email', 'phone', 'city'] devueltos por el endpoint /partners.
interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    city: string; 
}

// ----------------------------------------------
// Componente Auxiliar: LoadingSpinner
// ----------------------------------------------
const LoadingSpinner = () => (
    <RefreshCw className="w-5 h-5 animate-spin text-[#a89076]" />
);

// ----------------------------------------------
// Componente Principal: CustomersList
// ----------------------------------------------
export default function CustomersList() {
    
    // --- Estado para la Tabla de Clientes ---
    const [clients, setClients] = useState<Client[]>([]);
    const [isFetchingClients, setIsFetchingClients] = useState(true);
    const [fetchError, setFetchError] = useState('');
    
    // --- Estado para Paginación ---
    const [currentPage, setCurrentPage] = useState(1); 
    const limit = 10; // Límite de 10 elementos por página, como en server.js

    // Asumimos que el employee_id está en localStorage (seteado al iniciar sesión)
    const employeeId = localStorage.getItem('employee_id');

    /**
     * Función para obtener la lista de clientes, filtrada por el employee_id del vendedor.
     */
    const fetchClients = useCallback(async () => {
        setIsFetchingClients(true);
        setFetchError('');
        
        // Validación básica (aunque el backend también valida)
        if (!employeeId) {
            setFetchError('Error de autenticación: ID de empleado no encontrado.');
            setIsFetchingClients(false);
            return;
        }
        
        // 1. Calcular el offset (salto) para la paginación
        const offset = (currentPage - 1) * limit; 
        
        try {
            // ✅ CORRECCIÓN 2: Construir la URL con employee_id, limit y offset
            const url = `${API_URL}/partners?employee_id=${employeeId}&limit=${limit}&offset=${offset}`;

            const response = await fetch(url);
            
            if (!response.ok) {
                // ✅ CORRECCIÓN 3: Manejo de errores de validación específicos del backend
                const errorData = await response.json();
                setFetchError(errorData.error || `Error del servidor: ${response.statusText}`);
                setClients([]);
                return;
            }

            const clientsData: Client[] = await response.json();
            
            // 2. Actualizar el estado de los clientes
            setClients(clientsData);
            
        } catch (err) {
            console.error('Error al consultar clientes:', err);
            setFetchError('Error interno al conectar con la API.');
            setClients([]);
        } finally {
            setIsFetchingClients(false);
        }
    }, [currentPage, employeeId, limit]); // currentPage y employeeId son las dependencias

    // useEffect para llamar a fetchClients cada vez que cambie la página o el ID del empleado
    useEffect(() => {
        fetchClients();
    }, [fetchClients]); // La dependencia fetchClients incluye currentPage y employeeId


    // Lógica para el botón de 'Atrás'
    const handleGoBack = () => {
        // En un entorno de routing simple (como este), se usa window.history.back()
        // Si usaras react-router-dom, usarías navigate(-1)
        window.history.back();
    };

    // Paginación
    const startEntry = clients.length > 0 ? (currentPage - 1) * limit + 1 : 0;
    const endEntry = startEntry + clients.length - 1;


    return (
          <div className="flex-1 relative">
     <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 lg:hidden">
                <h1 className="text-xl font-semibold text-gray-800">Lista Clientes</h1>
                {/* Puedes dejar el botón de notificaciones o quitarlo para mayor simpleza */}
                <button className="relative p-1 hover:bg-gray-50 rounded-lg">
                    <Bell size={20} className="text-gray-600" />
                </button>
            </header>

          <main className="p-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="mb-4 flex justify-between items-center">
                          <h2 className="text-xl font-semibold text-[#a89076] mb-6 border-b pb-4">
                       Clientes Registrados
                    </h2>
                        <button 
                            onClick={() => setCurrentPage(1)} // Forzar recarga al inicio
                            className="p-2 bg-gray-100 rounded-full text-[#a89076] hover:bg-gray-200 transition-colors"
                            disabled={isFetchingClients}
                        >
                            <RefreshCw size={20} className={isFetchingClients ? 'animate-spin' : ''} />
                        </button>
                    </div>

                    {fetchError && (
                        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <p className="font-semibold">Error al cargar clientes:</p>
                            <p>{fetchError}</p>
                        </div>
                    )}
                    
                    {isFetchingClients && !fetchError ? (
                        <div className="flex items-center justify-center p-12">
                            <LoadingSpinner />
                            <span className="ml-3 text-lg text-[#a89076]">Cargando clientes...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {clients.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-lg">
                                                No se encontraron clientes asignados.
                                            </td>
                                        </tr>
                                    ) : (
                                        clients.map((client) => (
                                            <tr key={client.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.id}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{client.name}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{client.email || 'N/A'}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone || 'N/A'}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{client.city || 'N/A'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Paginación - Simplificada al no tener conteo total */}
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-sm text-gray-500">
                                    Mostrando {startEntry} a {endEntry}
                                    {clients.length === limit && ' (y posiblemente más)'}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg transition-colors text-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    
                                    <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-[#a89076]">
                                        {currentPage}
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        // Deshabilitar el botón si la página actual no se llenó (indicando que es la última)
                                        disabled={clients.length < limit} 
                                        className="px-4 py-2 rounded-lg transition-colors text-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
