import { ArrowLeft, MapPin, Plus, Edit, Trash2, Home, Briefcase, MapPinned } from 'lucide-react';
import { useState } from 'react';

interface AddressesPageProps {
  onBack: () => void;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export function AddressesPage({ onBack }: AddressesPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'Casa',
      street: 'Calle Mayor 123, 3°B',
      city: 'Madrid',
      postalCode: '28013',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      name: 'Trabajo',
      street: 'Av. Diagonal 456',
      city: 'Barcelona',
      postalCode: '08006',
      isDefault: false
    }
  ]);

  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    name: '',
    street: '',
    city: '',
    postalCode: ''
  });

  const handleAddAddress = () => {
    if (!formData.street || !formData.city || !formData.postalCode) {
      return;
    }

    const newAddress: Address = {
      id: Date.now().toString(),
      ...formData,
      isDefault: addresses.length === 0
    };

    setAddresses([...addresses, newAddress]);
    setFormData({ type: 'home', name: '', street: '', city: '', postalCode: '' });
    setShowAddForm(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const getAddressIcon = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5 text-green-600" />;
      case 'work':
        return <Briefcase className="w-5 h-5 text-green-600" />;
      default:
        return <MapPinned className="w-5 h-5 text-green-600" />;
    }
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
          <h1 className="text-white flex-1 text-center">Mis Direcciones</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="max-w-md mx-auto pb-8">
        {/* Add Address Button */}
        <div className="mt-4 mx-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-white text-green-600 py-4 rounded-xl hover:bg-green-50 transition-all shadow-sm border border-green-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Añadir nueva dirección</span>
          </button>
        </div>

        {/* Add Address Form */}
        {showAddForm && (
          <div className="mt-4 mx-4 bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Nueva dirección</h3>
            
            <div className="space-y-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Tipo</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, type: 'home' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.type === 'home'
                        ? 'border-green-600 bg-green-50 text-green-600'
                        : 'border-gray-200 text-gray-600 hover:border-green-300'
                    }`}
                  >
                    <Home className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Casa</span>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'work' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.type === 'work'
                        ? 'border-green-600 bg-green-50 text-green-600'
                        : 'border-gray-200 text-gray-600 hover:border-green-300'
                    }`}
                  >
                    <Briefcase className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Trabajo</span>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'other' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.type === 'other'
                        ? 'border-green-600 bg-green-50 text-green-600'
                        : 'border-gray-200 text-gray-600 hover:border-green-300'
                    }`}
                  >
                    <MapPinned className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Otro</span>
                  </button>
                </div>
              </div>

              {/* Name (optional) */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nombre (opcional)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Casa de verano"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Street */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Calle y número *</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Ej: Calle Mayor 123, 3°B"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Ciudad *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ej: Madrid"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Código postal *</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="Ej: 28013"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddAddress}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Addresses List */}
        <div className="mt-4 mx-4 space-y-3">
          {addresses.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No tienes direcciones guardadas</p>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getAddressIcon(address.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="text-gray-900 font-medium">
                          {address.name || (address.type === 'home' ? 'Casa' : address.type === 'work' ? 'Trabajo' : 'Otro')}
                        </h3>
                        {address.isDefault && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Predeterminada
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button className="text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full p-1.5 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full p-1.5 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-1">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.postalCode}, {address.city}
                    </p>

                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="mt-3 text-sm text-green-600 hover:underline"
                      >
                        Establecer como predeterminada
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
