import { useState, useEffect } from 'react';
import { User, Sun, Moon, Contrast, MapPin, Plus, Settings, Heart } from 'lucide-react';
import { toast, Toaster } from 'sonner';
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


function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
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
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          const formattedProducts = data.map((item: any) => {
            const defaultLocation = item.locations?.[0] || { price: 0, location: '', seller: '' };
            return {
              id: item.id,
              name: item.name,
              image: item.image,
              category: item.category,
              weight: item.weight,
              price: defaultLocation.price,
              location: defaultLocation.location,
              seller: defaultLocation.seller,
              locations: item.locations
            };
          });
          setProducts(formattedProducts);
        } else {
          toast.error('Error al cargar los productos');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error al conectar con el servidor');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      toast.info('Obteniendo ubicación...', { duration: 2000 });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          setCurrentLocation('Mi ubicación actual');
          toast.success(`Ubicación obtenida: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          toast.error('No se pudo obtener la ubicación. Revisa los permisos de tu navegador.');
        }
      );
    } else {
      toast.error('Tu navegador no soporta geolocalización.');
    }
  };

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

  const processedProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (userCoords) {
      return matchesSearch;
    } else {
      const hasPharmacyInCity = product.locations?.some(loc => loc.location === currentLocation) || product.location === currentLocation;
      return matchesSearch && hasPharmacyInCity;
    }
  }).map(product => {
    if (userCoords && product.locations) {
      let closestLocation = product.locations[0];
      let minDistance = Infinity;
      
      product.locations.forEach(loc => {
        if (loc.lat && loc.lng) {
          const dist = calculateDistance(userCoords.lat, userCoords.lng, loc.lat, loc.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closestLocation = loc;
          }
        }
      });
      
      if (minDistance !== Infinity) {
        return {
          ...product,
          distance: Number(minDistance.toFixed(1)),
          location: closestLocation.location,
          seller: closestLocation.seller,
          price: closestLocation.price
        };
      }
      return product;
    } else {
      const cityLoc = product.locations?.find(loc => loc.location === currentLocation);
      if (cityLoc) {
        return {
          ...product,
          location: cityLoc.location,
          seller: cityLoc.seller,
          price: cityLoc.price,
          distance: undefined
        };
      }
      return {
        ...product,
        distance: undefined
      };
    }
  }).filter(product => {
    if (userCoords) {
      return maxDistance === null || (product.distance !== undefined && product.distance <= maxDistance);
    }
    return true; 
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
        userCoords={userCoords}
        currentLocation={currentLocation}
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
      <Toaster position="bottom-center" />
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
      {userCoords && (
        <div className="bg-white border-b border-green-100">
          <div className="max-w-md mx-auto px-4 py-3">
            <ProximityFilter 
              selected={maxDistance}
              onSelect={setMaxDistance}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-green-700">
            {processedProducts.length} {processedProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid 
          products={processedProducts} 
          onProductClick={handleProductClick}
          favoriteIds={favoriteLocationIds}
          onToggleFavorite={toggleFavoriteLocation}
        />

        {/* No Results */}
        {processedProducts.length === 0 && (
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
        onGetLocation={() => {
          setIsProfileModalOpen(false);
          handleGetLocation();
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
                    setIsLocationModalOpen(false);
                    handleGetLocation();
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
                    setUserCoords(null);
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