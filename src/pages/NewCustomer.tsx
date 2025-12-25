import React, { useState, useEffect } from 'react';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Save, 
    RefreshCw,
    Bell 
} from 'lucide-react';

// URL de la API
const API_URL = import.meta.env.VITE_API_URL;

// ----------------------------------------------
// Componente Auxiliar: LoadingSpinner
// ----------------------------------------------
const LoadingSpinner = () => (
    <RefreshCw className="w-5 h-5 animate-spin text-white" />
);

// ----------------------------------------------
// Interfaces
// ----------------------------------------------
interface FormData {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    zip: string;
    country_id: number; 
}

interface Country {
    id: number;
    name: string;
}

interface MessageState {
    text: string;
    type: 'success' | 'error' | '';
}

export default function NewCustomer() {

   
    // Estados
    const [formData, setFormData] = useState<FormData>({
        name: '', 
        email: '', 
        phone: '', 
        street: '', 
        city: 'Medellin', 
        zip: '050001', 
        country_id: 0, 
    });
    
    const [countries, setCountries] = useState<Country[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [message, setMessage] = useState<MessageState>({ text: '', type: '' });

    const employeeId = localStorage.getItem('employee_id');

    // ----------------------------------------------
    // Efecto para cargar países y preseleccionar Colombia
    // ----------------------------------------------
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setIsLoadingCountries(true);
                const response = await fetch(`${API_URL}/countries`);
                if (!response.ok) throw new Error('Error al obtener países');
                
                const data: Country[] = await response.json();
                setCountries(data);

                // Buscar Colombia por nombre para obtener su ID dinámicamente
                const colombia = data.find(c => 
                    c.name.toLowerCase() === 'colombia'
                );
                
                if (colombia) {
                    setFormData(prev => ({ ...prev, country_id: colombia.id }));
                }
            } catch (error) {
                console.error("Error cargando países:", error);
            } finally {
                setIsLoadingCountries(false);
            }
        };

        fetchCountries();
    }, []);

    // Actualizar estado del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'country_id' ? parseInt(value, 10) : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!employeeId) {
            setMessage({ text: 'Error: No se encontró el ID del vendedor. Inicie sesión de nuevo.', type: 'error' });
            return;
        }

        if (!formData.name || !formData.email) {
             setMessage({ text: 'El Nombre y el Email son obligatorios.', type: 'error' });
             return;
        }

        setIsSaving(true);
        setMessage({ text: '', type: '' });

        const payload = {
            ...formData,
            employee_id: employeeId, 
        };

        try {
            const response = await fetch(`${API_URL}/register-partner`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            let data: any = {};
            try {
                data = await response.json(); 
            } catch (error) {
                console.error('Fallo al parsear respuesta JSON');
            }

            if (response.ok) {
                setMessage({ 
                    text: data.message || `Cliente ${formData.name} registrado con éxito.`, 
                    type: 'success' 
                });
                // Resetear formulario (manteniendo el país actual seleccionado)
                const currentCountry = formData.country_id;
                setFormData({
                    name: '', email: '', phone: '', street: '', city: '', zip: '', 
                    country_id: currentCountry, 
                });
            } else {
                const errorText = data.error || data.detailedError || 'Error desconocido del servidor.';
                setMessage({ text: `Error: ${errorText}`, type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error de red. No se pudo conectar con el servidor.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex-1 relative">
            <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 lg:hidden">
                <h1 className="text-xl font-semibold text-gray-800">Nuevo Cliente</h1>
                <button className="relative p-1 hover:bg-gray-50 rounded-lg">
                    <Bell size={20} className="text-gray-600" />
                </button>
            </header>

            <div className="p-8">
                <main className="bg-white p-8 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold text-[#a89076] mb-6 border-b pb-4">
                        Información del Cliente
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <User size={16} /> Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Mail size={16} /> Correo Electrónico *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
                                    required
                                />
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Phone size={16} /> Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
                                />
                            </div>

                            {/* País - SELECT DINÁMICO */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MapPin size={16} /> País
                                </label>
                                <select
                                    name="country_id"
                                    value={formData.country_id}
                                    onChange={handleChange}
                                    disabled={isLoadingCountries}
                                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076] disabled:opacity-50"
                                >
                                    <option value={0}>Seleccione un país...</option>
                                    {countries.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Calle */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MapPin size={16} /> Dirección (Calle)
                                </label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
                                />
                            </div>

                            {/* Ciudad */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
                                />
                            </div>

                            {/* Código Postal 
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Código Postal
                                </label>
                                <input
                                    type="text"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
                                />
                            </div> */}
                        </div>

                        {message.text && (
                            <div className={`mt-6 p-4 rounded-lg text-sm font-semibold ${
                                message.type === 'success' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <div className="flex justify-end pt-8">
                            <button
                                type="submit"
                                className={`px-8 py-3 rounded-lg flex items-center gap-2 transition-colors font-semibold ${
                                    isSaving 
                                        ? 'bg-[#967d63] cursor-not-allowed text-white' 
                                        : 'bg-[#a89076] hover:bg-[#967d63] text-white'
                                }`}
                                disabled={isSaving || isLoadingCountries}
                            >
                                {isSaving ? <LoadingSpinner /> : <Save size={20} />}
                                {isSaving ? 'Guardando Cliente...' : 'Guardar Cliente'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}