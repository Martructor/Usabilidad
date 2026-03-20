import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, UserCircle, Upload, RefreshCw } from 'lucide-react';

interface UserMenuProps {
  onProfileClick: () => void;
  onAddProductClick: () => void;
  onUpdateProductClick: () => void;
}

export function UserMenu({ onProfileClick, onAddProductClick, onUpdateProductClick }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <User className="w-5 h-5 text-white" />
        <ChevronDown className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <button
            onClick={() => {
              onProfileClick();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-left"
          >
            <UserCircle className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Mi perfil</span>
          </button>

          <button
            onClick={() => {
              onAddProductClick();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-left"
          >
            <Upload className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Subir producto</span>
          </button>

          <button
            onClick={() => {
              onUpdateProductClick();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-left"
          >
            <RefreshCw className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Actualizar producto</span>
          </button>
        </div>
      )}
    </div>
  );
}
