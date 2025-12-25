import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, XCircle, User, Phone, Mail, ChevronRight } from 'lucide-react';
import type { Partner } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL;

interface PartnerSearchInputProps {
  onPartnerSelect: (partner: Partner | null) => void;
  initialPartner?: Partner | null;
}

export default function PartnerSearchInput({ onPartnerSelect, initialPartner = null }: PartnerSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [basePartners, setBasePartners] = useState<Partner[]>([]); 
  const [searchResults, setSearchResults] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchBasePartners = useCallback(async () => {
    const eid = localStorage.getItem('employee_id');
    if (!eid) return;
    try {
      setIsLoading(true);
      const resp = await fetch(`${API_URL}/partners?employee_id=${eid}&limit=20`);
      const data = await resp.json();
      const list = Array.isArray(data) ? data : [];
      setBasePartners(list);
    } catch (e) { 
      console.error("Error loading select list", e); 
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  const fetchFilteredPartners = useCallback(async (query: string) => {
    const eid = localStorage.getItem('employee_id');
    if (!eid) return;
    
    setIsLoading(true);
    try {
      const resp = await fetch(`${API_URL}/partners?search=${encodeURIComponent(query)}&employee_id=${eid}&limit=20`);
      const data = await resp.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Error searching", e); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchBasePartners(); }, [fetchBasePartners]);

  useEffect(() => {
    if (searchTerm.length >= 2) { 
      const delay = setTimeout(() => fetchFilteredPartners(searchTerm), 300);
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]); 
    }
  }, [searchTerm, fetchFilteredPartners]);

  const handleSelect = (p: Partner) => {
    onPartnerSelect(p);
  };

  const handleClear = () => {
    setSearchTerm('');
    onPartnerSelect(null);
    inputRef.current?.focus();
  };

  const displayList = searchTerm.length >= 2 ? searchResults : basePartners;

  return (
    <div className="flex flex-col h-full w-full">
      {/* --- BARRA DE BÚSQUEDA --- */}
      <div 
        className="
          flex items-center w-full mb-3 px-3 py-2.5 
          bg-[#faf8f4] border border-[#e8dfd0] rounded-xl 
          focus-within:ring-1 focus-within:ring-[#a89076] focus-within:border-[#a89076] 
          focus-within:bg-white
          transition-all shadow-sm flex-shrink-0
        "
      >
        <Search className="h-5 w-5 text-[#a89076] mr-3 flex-shrink-0" />
        
        {/* INPUT: text-base (16px) previene el zoom en móviles */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            flex-1 bg-transparent border-none p-0 
            text-gray-900 placeholder-gray-400 
            text-base focus:ring-0 leading-tight
          "
        />

        {searchTerm && (
          <button 
            onClick={handleClear}
            className="ml-2 p-1 text-gray-400 hover:text-red-400 flex-shrink-0"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* --- LISTA DE RESULTADOS --- */}
      <div className="flex-1 overflow-y-auto -mx-2 px-2 pb-4">
        {isLoading && searchTerm.length >= 2 ? (
           <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#a89076] mb-2"></div>
              <span className="text-xs">Buscando...</span>
           </div>
        ) : displayList.length > 0 ? (
          <ul className="space-y-2">
            {displayList.map((p) => (
              <li
                key={p.id}
                onClick={() => handleSelect(p)}
                className="
                    group flex items-center gap-3 p-3 rounded-xl cursor-pointer 
                    bg-white border border-gray-100 shadow-sm
                    hover:border-[#a89076] hover:shadow-md transition-all
                "
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#f0e4d8] flex items-center justify-center text-[#8c735a] font-bold text-sm">
                    {p.name ? p.name.substring(0, 2).toUpperCase() : '??'}
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="text-sm font-bold text-gray-800 truncate">
                    {p.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                     <Mail size={12} className="flex-shrink-0 text-[#a89076]" />
                     <span className="truncate">{p.email || 'Sin email'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                      <Phone size={12} className="flex-shrink-0 text-[#a89076]" />
                      <span className="truncate">{p.phone || 'Sin teléfono'}</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-gray-300 group-hover:text-[#a89076] transition-colors">
                    <ChevronRight className="h-5 w-5" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-sm opacity-60">
                <User className="h-10 w-10 mb-2 opacity-20" />
                {searchTerm ? 'No se encontraron clientes' : 'Empieza a escribir...'}
            </div>
        )}
      </div>
    </div>
  );
}