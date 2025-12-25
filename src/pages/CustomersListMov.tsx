// src/pages/CustomersListMov.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
    Bell, 
    Search, 
    Download, 
    RefreshCw, 
    Users,
    Mail,
    Phone,
    MapPin,
    ArrowLeft
} from 'lucide-react';

// URL de la API (tomada de server.js)
const API_URL = import.meta.env.VITE_API_URL;

// ----------------------------------------------
// Interfaces de Datos (las mismas que la versión Desktop)
// ----------------------------------------------
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
// Componente Principal: CustomersListMov
// ----------------------------------------------
export default function CustomersListMov() {
    
    // --- Estado para la Lista de Clientes ---
    const [clients, setClients] = useState<Client[]>([]);
    const [isFetchingClients, setIsFetchingClients] = useState(true);
    const [fetchError, setFetchError] = useState('');
    
    // --- Estado para Paginación y Búsqueda ---
    const [currentPage, setCurrentPage] = useState(1); 
    const [searchTerm, setSearchTerm] = useState('');
    const limit = 10; // Límite de 10 elementos por página

    const employeeId = localStorage.getItem('employee_id');

    // 🔑 Mantenemos la lógica de API idéntica a la versión Desktop
    const fetchClients = useCallback(async (page: number, search: string) => {
        if (!employeeId) {
            setFetchError('Error: No se encontró el ID del vendedor.');
            setIsFetchingClients(false);
            return;
        }

        setIsFetchingClients(true);
        setFetchError('');
        
        // Calcular offset: (página - 1) * límite
        const offset = (page - 1) * limit;

        const queryParams = new URLSearchParams({
            employee_id: employeeId,
            limit: String(limit),
            offset: String(offset),
            ...(search && { search: search }) // Solo añade 'search' si tiene valor
        }).toString();

        try {
            const response = await fetch(`${API_URL}/partners?${queryParams}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fallo al cargar clientes');
            }
            
            const data: Client[] = await response.json();
            setClients(data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            setClients([]);
            setFetchError(error instanceof Error ? error.message : 'Error desconocido al cargar clientes.');
        } finally {
            setIsFetchingClients(false);
        }
    }, [employeeId, limit]);
    
    // Efecto para cargar clientes al cambiar la página o la búsqueda
    useEffect(() => {
        fetchClients(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchClients]);

    // Función de búsqueda (resetea la paginación)
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Resetea la página al buscar
    };

    // ----------------------------------------------
    // Componente Auxiliar: Card de Cliente (Diseño Móvil)
    // ----------------------------------------------
    const CustomerCard = ({ client }: { client: Client }) => (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2 border-b pb-2">
                <h3 className="text-lg font-bold text-[#a89076] truncate pr-2">{client.name}</h3>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">ID: {client.id}</span>
            </div>
            <div className="space-y-1 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="truncate">{client.email}</span>
                </p>
                <p className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    <span>{client.phone || 'N/A'}</span>
                </p>
                <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span>{client.city || 'Ciudad Desconocida'}</span>
                </p>
            </div>
            {/* Aquí podrías añadir un botón de "Ver Detalle" */}
        </div>
    );
    // ----------------------------------------------


    return (
        <div className="flex-1 relative">
            {/* Header simplificado para móvil/tablet */}
            <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 lg:hidden">
                <h1 className="text-xl font-semibold text-gray-800">Lista Clientes</h1>
                {/* Puedes poner un icono de Notificaciones o Menú aquí */}
                <button className="p-1 hover:bg-gray-50 rounded-lg">
                    <Bell size={20} className="text-gray-600" />
                </button>
            </header>

            <main className="p-4">
                <div className="space-y-4">
                    
                    {/* Barra de Búsqueda y Acciones (compacta) */}
                    <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar cliente por nombre o email..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#a89076]"
                            />
                        </div>
                        <div className="flex justify-between gap-2">
                            <button
                                onClick={() => fetchClients(currentPage, searchTerm)}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                                disabled={isFetchingClients}
                            >
                                <RefreshCw size={16} className={isFetchingClients ? 'animate-spin' : ''} />
                                Refrescar
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-[#a89076] text-white rounded-lg text-sm hover:bg-[#967d63]">
                                <Download size={16} />
                                Exportar
                            </button>
                        </div>
                    </div>

                    {/* Contenido principal (Lista de Tarjetas) */}
                    <div className="min-h-[400px]">
                        {isFetchingClients ? (
                            <div className="flex justify-center items-center h-full min-h-[400px]">
                                <LoadingSpinner />
                                <span className="ml-2 text-gray-600">Cargando clientes...</span>
                            </div>
                        ) : fetchError ? (
                            <div className="p-6 bg-red-100 text-red-700 rounded-lg font-semibold">
                                Error: {fetchError}
                            </div>
                        ) : clients.length === 0 ? (
                            <div className="p-6 bg-yellow-100 text-yellow-700 rounded-lg font-semibold">
                                No se encontraron clientes que coincidan con la búsqueda.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {clients.map(client => (
                                    <CustomerCard key={client.id} client={client} />
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Paginación (ajustada para móvil) */}
                    {!isFetchingClients && clients.length > 0 && (
                        <div className="mt-4 bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex justify-center items-center">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg transition-colors text-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    
                                    <span className="text-sm font-semibold text-[#a89076]">
                                        Página {currentPage}
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
