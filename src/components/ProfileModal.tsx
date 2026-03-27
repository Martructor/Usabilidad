import { X, User as UserIcon, Mail, MapPin, Heart, Settings, LogOut, Navigation } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onViewProfile: () => void;
  onViewSettings: () => void;
  onViewFavorites: () => void;
  onViewAddresses: () => void;
  onGetLocation: () => void;
  userName: string;
  userEmail: string;
}

export function ProfileModal({ isOpen, onClose, onLogout, onViewProfile, onViewSettings, onViewFavorites, onViewAddresses, onGetLocation, userName, userEmail }: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-white">{userName}</h2>
              <p className="text-white/80 text-sm">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          <button 
            onClick={onGetLocation}
            className="w-full flex items-center gap-3 p-4 hover:bg-green-50 rounded-lg transition-colors text-left"
          >
            <Navigation className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Obtener mi ubicación actual</span>
          </button>

          <button 
            onClick={onViewProfile}
            className="w-full flex items-center gap-3 p-4 hover:bg-green-50 rounded-lg transition-colors text-left"
          >
            <UserIcon className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Mi perfil</span>
          </button>

          <button 
            onClick={onViewFavorites}
            className="w-full flex items-center gap-3 p-4 hover:bg-green-50 rounded-lg transition-colors text-left"
          >
            <Heart className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Favoritos</span>
          </button>

          <button 
            onClick={onViewAddresses}
            className="w-full flex items-center gap-3 p-4 hover:bg-green-50 rounded-lg transition-colors text-left"
          >
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Direcciones</span>
          </button>

          <button 
            onClick={onViewSettings}
            className="w-full flex items-center gap-3 p-4 hover:bg-green-50 rounded-lg transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Configuración</span>
          </button>

          <div className="border-t border-gray-200 my-2"></div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-4 hover:bg-red-50 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="text-red-600">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}