import { ArrowLeft, User as UserIcon, Mail, Phone, MapPin, Calendar, Edit, Heart, ShoppingBag, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ProfilePageProps {
  onBack: () => void;
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

export function ProfilePage({ onBack, userName, userEmail, onLogout }: ProfilePageProps) {
  const [notificationsPush, setNotificationsPush] = useState(true);
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [offersEmail, setOffersEmail] = useState(true);

  useEffect(() => {
    const savedPush = localStorage.getItem('boticario_notif_push');
    const savedEmail = localStorage.getItem('boticario_notif_email');
    const savedOffers = localStorage.getItem('boticario_offers_email');

    if (savedPush !== null) setNotificationsPush(savedPush === 'true');
    if (savedEmail !== null) setNotificationsEmail(savedEmail === 'true');
    if (savedOffers !== null) setOffersEmail(savedOffers === 'true');
  }, []);

  const handleSaveSetting = (key: string, value: boolean) => {
    localStorage.setItem(key, value.toString());
  };

  const handlePushChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationsPush(e.target.checked);
    handleSaveSetting('boticario_notif_push', e.target.checked);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationsEmail(e.target.checked);
    handleSaveSetting('boticario_notif_email', e.target.checked);
  };

  const handleOffersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOffersEmail(e.target.checked);
    handleSaveSetting('boticario_offers_email', e.target.checked);
  };

  const handleManagePersonalData = () => {
    toast.info('Redirigiendo a gestión de datos personales...');
  };

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
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900 mb-1">{userName}</h2>
              <p className="text-sm text-gray-600">Usuario verificado</p>
            </div>
          </div>
          <button className="w-full bg-green-50 text-green-600 py-3 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
            <Edit className="w-4 h-4" />
            <span>Editar perfil</span>
          </button>
        </div>

        {/* Contact Info */}
        <div className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-900 mb-4">Información de contacto</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{userEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="text-gray-900">+34 600 123 456</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="text-gray-900">Calle Mayor 123, Madrid</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Miembro desde</p>
                <p className="text-gray-900">Febrero 2026</p>
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
              <p className="font-semibold text-gray-900">12</p>
              <p className="text-xs text-gray-600">Compras</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Heart className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">8</p>
              <p className="text-xs text-gray-600">Favoritos</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">5</p>
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
                <input type="checkbox" className="sr-only peer" checked={notificationsPush} onChange={handlePushChange} />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Notificaciones por email</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notificationsEmail} onChange={handleEmailChange} />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Ofertas y promociones</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={offersEmail} onChange={handleOffersChange} />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-4 mx-4 space-y-3">
          <button onClick={handleManagePersonalData} className="w-full bg-white text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-sm border border-gray-200">
            Gestionar datos personales
          </button>
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
