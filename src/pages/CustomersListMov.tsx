// src/pages/CustomersListMov.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Search,
  Download,
  RefreshCw,
  Users,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
}

const LoadingSpinner = () => (
  <RefreshCw className="w-5 h-5 animate-spin text-[#a89076]" />
);

export default function CustomersListMov() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isFetchingClients, setIsFetchingClients] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const employeeId = localStorage.getItem("employee_id");

  const fetchClients = useCallback(
    async (page: number, search: string) => {
      if (!employeeId) {
        setFetchError("Error: No se encontró el ID del vendedor.");
        setIsFetchingClients(false);
        return;
      }

      setIsFetchingClients(true);
      setFetchError("");

      const offset = (page - 1) * limit;

      const queryParams = new URLSearchParams({
        employee_id: employeeId,
        limit: String(limit),
        offset: String(offset),
        ...(search && { search }),
      }).toString();

      try {
        const response = await fetch(`${API_URL}/partners?${queryParams}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Fallo al cargar clientes");
        }

        const data: Client[] = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
        setClients([]);
        setFetchError(
          error instanceof Error
            ? error.message
            : "Error desconocido al cargar clientes.",
        );
      } finally {
        setIsFetchingClients(false);
      }
    },
    [employeeId, limit],
  );

  useEffect(() => {
    fetchClients(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchClients]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const CustomerCard = ({ client }: { client: Client }) => (
    <div
      className="bg-white shadow-sm border border-gray-100 px-4 py-3 space-y-2"
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        clipPath: "inset(0px round 24px)",
      }}
    >
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-[#faf6f1] flex items-center justify-center flex-shrink-0">
          <Users size={16} className="text-[#a89076]" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {client.name}
          </div>
        </div>
      </div>

      <div className="space-y-1 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-gray-500 flex-shrink-0" />
          <span className="truncate">{client.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-gray-500 flex-shrink-0" />
          <span>{client.phone || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-500 flex-shrink-0" />
          <span>{client.city || "Ciudad desconocida"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#f5f1e8] flex flex-col overflow-x-hidden">
      {/* Contenedor centrado y acotado como en Mis pedidos */}
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        {/* Header fijo */}
        <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 lg:hidden sticky top-0 z-20">
          <h1 className="text-xl font-semibold text-gray-800">
            Lista Clientes
          </h1>
          <button className="p-1 hover:bg-gray-50 rounded-lg">
            <Bell size={20} className="text-gray-600" />
          </button>
        </header>

        {/* Solo este main hace scroll */}
        <main className="flex-1 overflow-y-auto p-4 pb-32">
          <div className="w-full space-y-4">
            {/* Barra de búsqueda + acciones */}
            <div
              className="bg-white p-4 shadow-sm"
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                clipPath: "inset(0px round 24px)",
              }}
            >
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar cliente por nombre o email..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#a89076]"
                />
              </div>
              <div className="flex justify-between gap-2 mt-3">
                <button
                  onClick={() => fetchClients(currentPage, searchTerm)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                  disabled={isFetchingClients}
                >
                  <RefreshCw
                    size={16}
                    className={isFetchingClients ? "animate-spin" : ""}
                  />
                  Refrescar
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-[#a89076] text-white rounded-lg text-sm hover:bg-[#967d63]">
                  <Download size={16} />
                  Exportar
                </button>
              </div>
            </div>

            {/* Lista de clientes */}
            <div className="min-h-[400px]">
              {isFetchingClients ? (
                <div className="flex justify-center items-center h-full min-h-[400px] gap-2">
                  <LoadingSpinner />
                  <span className="text-gray-600 text-sm">
                    Cargando clientes...
                  </span>
                </div>
              ) : fetchError ? (
                <div
                  className="p-6 bg-red-100 text-red-700 font-semibold"
                  style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    clipPath: "inset(0px round 24px)",
                  }}
                >
                  Error: {fetchError}
                </div>
              ) : clients.length === 0 ? (
                <div
                  className="p-6 bg-yellow-100 text-yellow-700 font-semibold"
                  style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    clipPath: "inset(0px round 24px)",
                  }}
                >
                  No se encontraron clientes que coincidan con la búsqueda.
                </div>
              ) : (
                <div className="space-y-3">
                  {clients.map((client) => (
                    <CustomerCard key={client.id} client={client} />
                  ))}
                </div>
              )}
            </div>

            {/* Paginación */}
            {!isFetchingClients && clients.length > 0 && (
              <div
                className="mt-4 bg-white p-4 shadow-sm"
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  clipPath: "inset(0px round 24px)",
                }}
              >
                <div className="flex justify-center items-center">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg transition-colors text-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anterior
                    </button>

                    <span className="text-sm font-semibold text-[#a89076]">
                      Página {currentPage}
                    </span>

                    <button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
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
    </div>
  );
}
