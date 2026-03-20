import { useState } from 'react';
import { User, Sun, Moon, Contrast, MapPin, Plus, Settings, Heart } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { ProximityFilter } from './components/ProximityFilter';
import { ProductGrid } from './components/ProductGrid';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProfileModal } from './components/ProfileModal';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { AddressesPage } from './components/AddressesPage';
import { AddProductPage } from './components/AddProductPage';
import { UpdateProductPage } from './components/UpdateProductPage';
import { Product } from './types';
import { ProductDetailPage } from './components/ProductDetailPage';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 1g',
    price: 3.50,
    location: 'Madrid',
    category: 'Analgésicos',
    image: 'https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwcGlsbHN8ZW58MXx8fHwxNzcwOTc0MDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Farmacia Central',
    distance: 0.5,
    locations: [
      { id: '1-1', location: 'Madrid', seller: 'Farmacia Central', distance: 0.5, price: 3.50 },
      { id: '1-2', location: 'Madrid', seller: 'Farmacia Goya', distance: 1.2, price: 3.75 },
      { id: '1-3', location: 'Barcelona', seller: 'Farmacia Gracia', distance: 3.5, price: 3.60 }
    ]
  },
  {
    id: '2',
    name: 'Ibuprofeno 600mg',
    price: 4.20,
    location: 'Barcelona',
    category: 'Antiinflamatorios',
    image: 'https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwcGlsbHN8ZW58MXx8fHwxNzcwOTc0MDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Farmacia del Borne',
    distance: 2.3,
    locations: [
      { id: '2-1', location: 'Barcelona', seller: 'Farmacia del Borne', distance: 2.3, price: 4.20 },
      { id: '2-2', location: 'Barcelona', seller: 'Farmacia Rambla', distance: 4.0, price: 4.50 },
      { id: '2-3', location: 'Valencia', seller: 'Farmacia San Vicente', distance: 4.1, price: 4.30 }
    ]
  },
  {
    id: '3',
    name: 'Vitamina C 1000mg',
    price: 12.90,
    location: 'Valencia',
    category: 'Vitaminas y Suplementos',
    image: 'https://images.unsplash.com/photo-1763668331599-487470fb85b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXRhbWluJTIwc3VwcGxlbWVudHMlMjBib3R0bGVzfGVufDF8fHx8MTc3MDk1NTkwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Farmacia San Vicente',
    distance: 4.1,
    locations: [
      { id: '3-1', location: 'Valencia', seller: 'Farmacia San Vicente', distance: 4.1, price: 12.90 },
      { id: '3-2', location: 'Valencia', seller: 'Farmacia Ruzafa', distance: 0.8, price: 13.20 },
      { id: '3-3', location: 'Madrid', seller: 'Farmacia Mayor', distance: 1.2, price: 12.75 }
    ]
  },
  {
    id: '4',
    name: 'Termómetro Digital',
    price: 8.50,
    location: 'Madrid',
    category: 'Material Sanitario',
    image: 'https://images.unsplash.com/photo-1758206523692-7e9f89bcab5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGhlcm1vbWV0ZXIlMjBoZWFsdGh8ZW58MXx8fHwxNzcwOTM5NzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Farmacia Mayor',
    distance: 1.2,
    locations: [
      { id: '4-1', location: 'Madrid', seller: 'Farmacia Mayor', distance: 1.2, price: 8.50 },
      { id: '4-2', location: 'Sevilla', seller: 'Farmacia Triana', distance: 6.8, price: 9.00 }
    ]
  },
  {
    id: '5',
    name: 'Omeprazol 20mg',
    price: 5.80,
    location: 'Sevilla',
    category: 'Digestivos',
    image: 'https://images.unsplash.com/photo-1763142843470-9a9e9db7f68f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMGJvdHRsZXMlMjBtZWRpY2F0aW9ufGVufDF8fHx8MTc3MDk3OTI0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Farmacia Triana',
    distance: 6.8,
    locations: [
      { id: '5-1', location: 'Sevilla', seller: 'Farmacia Triana', distance: 6.8, price: 5.80 },
      { id: '5-2', location: 'Sevilla', seller: 'Farmacia Nervión', distance: 5.2, price: 5.90 },
      { id: '5-3', location: 'Madrid', seller: 'Farmacia Central', distance: 0.5, price: 6.00 }
    ]
  },
  {
    id: '6',
    name: 'Kit Primeros Auxilios',
    price: 15.99,
    location: 'Barcelona',
    category: 'Material Sanitario',
    image: 'https://images.unsplash.com/photo-1758204054683-6e3a7d552bd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc3VwcGxpZXMlMjBiYW5kYWdlc3xlbnwxfHx8fDE3NzA5NzkyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Farmacia Gracia',
    distance: 3.5,
    locations: [
      { id: '6-1', location: 'Barcelona', seller: 'Farmacia Gracia', distance: 3.5, price: 15.99 },
      { id: '6-2', location: 'Barcelona', seller: 'Farmacia del Borne', distance: 2.3, price: 16.50 }
    ]
  },
  {
    id: '7',
    name: 'Crema Hidratante Facial',
    price: 18.50,
    location: 'Valencia',
    category: 'Dermofarmacia',
    image: 'https://images.unsplash.com/photo-1618478064115-ba11c9aac7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGNyZWFtJTIwcGhhcm1hY3l8ZW58MXx8fHwxNzcwOTc5MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Farmacia Ruzafa',
    distance: 0.8,
    locations: [
      { id: '7-1', location: 'Valencia', seller: 'Farmacia Ruzafa', distance: 0.8, price: 18.50 },
      { id: '7-2', location: 'Valencia', seller: 'Farmacia San Vicente', distance: 4.1, price: 19.00 }
    ]
  },
  {
    id: '8',
    name: 'Complejo Vitamínico B',
    price: 14.30,
    location: 'Sevilla',
    category: 'Vitaminas y Suplementos',
    image: 'https://images.unsplash.com/photo-1763668331599-487470fb85b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXRhbWluJTIwc3VwcGxlbWVudHMlMjBib3R0bGVzfGVufDF8fHx8MTc3MDk1NTkwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Farmacia Nervión',
    distance: 5.2,
    locations: [
      { id: '8-1', location: 'Sevilla', seller: 'Farmacia Nervión', distance: 5.2, price: 14.30 },
      { id: '8-2', location: 'Sevilla', seller: 'Farmacia Triana', distance: 6.8, price: 14.50 }
    ]
  }
];

const locations = ['Todas', 'Madrid', 'Barcelona', 'Valencia', 'Sevilla'];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Todas');
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'register' | 'addProduct' | 'updateProduct' | 'productDetail' | 'profile' | 'settings' | 'favorites' | 'addresses'>('home');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favoriteLocationIds, setFavoriteLocationIds] = useState<string[]>([]);
  const [theme, setTheme] = useState<'normal' | 'highContrast' | 'dark'>('normal');
  const [currentLocation, setCurrentLocation] = useState('Madrid');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const toggleFavoriteLocation = (locationId: string) => {
    setFavoriteLocationIds(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  const cycleTheme = () => {
    setTheme(prev => {
      if (prev === 'normal') return 'highContrast';
      if (prev === 'highContrast') return 'dark';
      return 'normal';
    });
  };

  const getThemeIcon = () => {
    if (theme === 'normal') return <Sun className="w-6 h-6" />;
    if (theme === 'highContrast') return <Contrast className="w-6 h-6" />;
    return <Moon className="w-6 h-6" />;
  };

  const getThemeClasses = () => {
    if (theme === 'dark') {
      return 'bg-gray-900 text-white';
    }
    if (theme === 'highContrast') {
      return 'bg-white text-black';
    }
    return 'bg-green-50';
  };

  const handleLoginSuccess = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setIsProfileModalOpen(false);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('productDetail');
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === 'Todas' || product.location === selectedLocation;
    const matchesDistance = maxDistance === null || product.distance <= maxDistance;
    return matchesSearch && matchesLocation && matchesDistance;
  });

  // Show Login Page
  if (currentPage === 'login') {
    return (
      <LoginPage
        onBack={() => setCurrentPage('home')}
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => setCurrentPage('register')}
      />
    );
  }

  // Show Register Page
  if (currentPage === 'register') {
    return (
      <RegisterPage
        onBack={() => setCurrentPage('home')}
        onRegisterSuccess={handleLoginSuccess}
        onGoToLogin={() => setCurrentPage('login')}
      />
    );
  }

  // Show Add Product Page
  if (currentPage === 'addProduct') {
    return (
      <AddProductPage
        onBack={() => setCurrentPage('home')}
        onSuccess={() => setCurrentPage('home')}
      />
    );
  }

  // Show Update Product Page
  if (currentPage === 'updateProduct') {
    return (
      <UpdateProductPage
        onBack={() => setCurrentPage('home')}
        onSuccess={() => setCurrentPage('home')}
      />
    );
  }

  // Show Product Detail Page
  if (currentPage === 'productDetail' && selectedProduct) {
    return (
      <ProductDetailPage
        product={selectedProduct}
        onBack={() => setCurrentPage('home')}
        favoriteLocationIds={favoriteLocationIds}
        onToggleFavoriteLocation={toggleFavoriteLocation}
      />
    );
  }

  // Show Profile Page
  if (currentPage === 'profile') {
    return (
      <ProfilePage
        onBack={() => setCurrentPage('home')}
        userName={userName}
        userEmail={userEmail}
      />
    );
  }

  // Show Settings Page
  if (currentPage === 'settings') {
    return (
      <SettingsPage
        onBack={() => setCurrentPage('home')}
      />
    );
  }

  // Show Favorites Page
  if (currentPage === 'favorites') {
    return (
      <FavoritesPage
        onBack={() => setCurrentPage('home')}
        onProductClick={handleProductClick}
      />
    );
  }

  // Show Addresses Page
  if (currentPage === 'addresses') {
    return (
      <AddressesPage
        onBack={() => setCurrentPage('home')}
      />
    );
  }

  // Home Page
  return (
    <div className={`min-h-screen ${getThemeClasses()}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-green-600 border-b border-green-600 sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 gap-2">
            {/* Ubicación actual */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors flex-shrink-0"
            >
              <MapPin className="w-5 h-5" />
              <span className="text-base font-medium">{currentLocation}</span>
            </button>

            {/* Título centrado */}
            <h1 className="text-center text-white flex-1 text-lg md:text-xl">El Boticario</h1>

            {/* Botones de la derecha */}
            <div className="flex gap-2 items-center flex-shrink-0">
              {/* Botón de tema */}
              <button
                onClick={cycleTheme}
                className="text-white hover:bg-white/20 rounded-full p-2.5 transition-colors"
                title={`Tema: ${theme === 'normal' ? 'Normal' : theme === 'highContrast' ? 'Alto contraste' : 'Oscuro'}`}
              >
                {getThemeIcon()}
              </button>

              {isLoggedIn ? (
                <button 
                  onClick={() => setCurrentPage('profile')}
                  className="text-white hover:bg-white/20 rounded-full p-2.5 transition-colors"
                  title="Ver perfil"
                >
                  <User className="w-6 h-6" />
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="px-4 py-2 rounded-full bg-white text-green-600 hover:bg-white/90 transition-colors text-sm whitespace-nowrap"
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </header>

      {/* Proximity Filter */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-md mx-auto px-4 py-3">
          <ProximityFilter 
            selected={maxDistance}
            onSelect={setMaxDistance}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-green-700">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid 
          products={filteredProducts} 
          onProductClick={handleProductClick}
          favoriteIds={favoriteLocationIds}
          onToggleFavorite={toggleFavoriteLocation}
        />

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-green-600">No se encontraron productos</p>
            <p className="text-sm text-green-500 mt-2">Intenta con otra búsqueda o ubicación</p>
          </div>
        )}
      </main>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        onLogout={handleLogout}
        onViewProfile={() => {
          setIsProfileModalOpen(false);
          setCurrentPage('profile');
        }}
        onViewSettings={() => {
          setIsProfileModalOpen(false);
          setCurrentPage('settings');
        }}
        onViewFavorites={() => {
          setIsProfileModalOpen(false);
          setCurrentPage('favorites');
        }}
        onViewAddresses={() => {
          setIsProfileModalOpen(false);
          setCurrentPage('addresses');
        }}
        userName={userName}
        userEmail={userEmail}
      />

      {/* Modal de Ubicación */}
      {isLocationModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setIsLocationModalOpen(false)}
        >
          <div 
            className="bg-white rounded-t-3xl max-w-md w-full p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-gray-900 mb-4 text-center">Selecciona tu ubicación</h3>
            <div className="space-y-2">
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setCurrentLocation('Mi ubicación');
                    setIsLocationModalOpen(false);
                  }}
                  className={`w-full p-4 rounded-lg text-left transition-colors ${
                    currentLocation === 'Mi ubicación'
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Mi ubicación</span>
                  </div>
                </button>
              )}
              {['Madrid', 'Barcelona', 'Valencia', 'Sevilla'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setCurrentLocation(city);
                    setIsLocationModalOpen(false);
                  }}
                  className={`w-full p-4 rounded-lg text-left transition-colors ${
                    currentLocation === city
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{city}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons - Footer */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Botón de Favoritos */}
        <button
          onClick={() => isLoggedIn ? setCurrentPage('favorites') : setCurrentPage('login')}
          className="w-14 h-14 bg-white text-green-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center border-2 border-green-500"
          title="Favoritos"
        >
          <Heart className="w-6 h-6" />
        </button>

        {/* Botón de Configuración */}
        <button
          onClick={() => isLoggedIn ? setCurrentPage('settings') : setCurrentPage('login')}
          className="w-14 h-14 bg-white text-green-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center border-2 border-green-500"
          title="Configuración"
        >
          <Settings className="w-6 h-6" />
        </button>

        {/* Botón de Añadir */}
        <button
          onClick={() => isLoggedIn ? setCurrentPage('addProduct') : setCurrentPage('login')}
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
          title="Añadir producto"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}