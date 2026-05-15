import { ArrowLeft, User as UserIcon, Mail, Phone, MapPin, Calendar, Edit, Heart, ShoppingBag, Clock, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ProfilePageProps {
  onBack: () => void;
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

export function ProfilePage({ onBack, userName, userEmail, onLogout }: ProfilePageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    nombre_apellidos: userName,
    email: userEmail,
    telefono: '',
    direccion: ''
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    ofertas: false
  });

  const [joinedDate, setJoinedDate] = useState('Febrero 2026');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('boticario_token');
    if (!token) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setFormData({
          nombre_apellidos: data.nombre_apellidos || '',
          email: data.email || '',
          telefono: data.telefono || '',
          direccion: data.direccion || ''
        });
        
        if (data.ajustes?.notificaciones) {
          setNotifications({
            push: data.ajustes.notificaciones.push ?? true,
            email: data.ajustes.notificaciones.email ?? true,
            ofertas: data.ajustes.notificaciones.ofertas ?? false
          });
        }

        if (data.createdAt) {
          const date = new Date(data.createdAt);
          setJoinedDate(date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }));
        }
      }
    } catch (error) {
      console.error('Error fetching profile', error);
      toast.error('Error al cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    const token = localStorage.getItem('boticario_token');
    if (!token) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success('Perfil actualizado correctamente');
        setIsEditing(false);
        // Update local storage names to reflect across the app if changed
        localStorage.setItem('boticario_user_name', formData.nombre_apellidos);
      } else {
        toast.error('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión');
    }
  };

  const updateNotification = async (key: keyof typeof notifications, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);

    const token = localStorage.getItem('boticario_token');
    if (!token) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificaciones: newNotifications })
      });
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar preferencias');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-green-600 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white flex-1 text-center">Mi Perfil</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="max-w-md mx-auto pb-8">
        {/* Profile Header */}
        <div className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shrink-0">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 overflow-hidden">
              {isEditing ? (
                <input 
                  type="text" 
                  name="nombre_apellidos"
                  value={formData.nombre_apellidos}
                  onChange={handleInputChange}
                  className="w-full text-gray-900 mb-1 border-b-2 border-green-500 focus:outline-none font-semibold text-lg bg-gray-50 p-1"
                  placeholder="Tu nombre"
                />
              ) : (
                <h2 className="text-gray-900 mb-1 truncate">{formData.nombre_apellidos}</h2>
              )}
              <p className="text-sm text-gray-600">Usuario verificado</p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={saveProfile}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </button>
              <button 
                onClick={() => { setIsEditing(false); fetchProfile(); }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full bg-green-50 text-green-600 py-3 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              <span>Editar perfil</span>
            </button>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-900 mb-4">Información de contacto</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                {isEditing ? (
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-300 focus:border-green-500 focus:outline-none py-1 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{formData.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Teléfono</p>
                {isEditing ? (
                  <input 
                    type="tel" 
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+34 XXX XXX XXX"
                    className="w-full border-b border-gray-300 focus:border-green-500 focus:outline-none py-1 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{formData.telefono || 'No especificado'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Dirección</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Tu dirección"
                    className="w-full border-b border-gray-300 focus:border-green-500 focus:outline-none py-1 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{formData.direccion || 'No especificada'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Miembro desde</p>
                <p className="text-gray-900 capitalize">{joinedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-900 mb-4">Actividad</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">0</p>
              <p className="text-xs text-gray-600">Compras</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Heart className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">0</p>
              <p className="text-xs text-gray-600">Favoritos</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">0</p>
              <p className="text-xs text-gray-600">Recientes</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-900 mb-4">Notificaciones y Preferencias</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Notificaciones push</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.push} 
                  onChange={(e) => updateNotification('push', e.target.checked)} 
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Notificaciones por email</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.email} 
                  onChange={(e) => updateNotification('email', e.target.checked)} 
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Ofertas y promociones</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.ofertas} 
                  onChange={(e) => updateNotification('ofertas', e.target.checked)} 
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-4 mx-4 space-y-3">
          <button className="w-full bg-white text-green-600 py-4 rounded-xl hover:bg-green-50 transition-all shadow-sm border border-green-200">
            Cambiar contraseña
          </button>
          <button 
            onClick={onLogout}
            className="w-full bg-white text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-sm border border-gray-200"
          >
            Cerrar sesión
          </button>
          <button className="w-full bg-white text-red-600 py-4 rounded-xl hover:bg-red-50 transition-all shadow-sm border border-red-200">
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
