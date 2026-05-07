import { ArrowLeft, Heart, MapPin, Store } from 'lucide-react';
import { Product } from '../types';
import { useState, useEffect } from 'react';

interface FavoritesPageProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onToggleFavorite: (productId: string, pharmacyId: string) => void;
}

export function FavoritesPage({ onBack, onProductClick, onToggleFavorite }: FavoritesPageProps) {
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('boticario_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/users/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavoriteProducts(data);
      }
    } catch (e) {
      console.error('Error fetching favorites:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleUnfavorite = async (e: React.MouseEvent, productId: string, pharmacyId: string) => {
    e.stopPropagation();
    await onToggleFavorite(productId, pharmacyId);
    // Refetch favorites after toggling
    fetchFavorites();
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
          <h1 className="text-white flex-1 text-center">Mis Favoritos</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="max-w-md mx-auto pb-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : favoriteProducts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-2">No tienes favoritos</h2>
            <p className="text-gray-600 text-center text-sm">
              Los productos que marques como favoritos aparecerán aquí
            </p>
          </div>
        ) : (
          /* Favorites List */
          <div className="mt-4 mx-4 space-y-3">
            <p className="text-sm text-gray-600 mb-2">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto' : 'productos'}
            </p>
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-gray-900 font-medium truncate">{product.name}</h3>
                      <button 
                        onClick={(e) => handleUnfavorite(e, product.id, product.pharmacyId)}
                        className="text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors flex-shrink-0"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <Store className="w-3 h-3" />
                      <span className="truncate">{product.seller}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{product.location}</span>
                        {product.distance !== undefined && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span>{product.distance} km</span>
                          </>
                        )}
                      </div>
                      <p className="font-semibold text-green-600">{product.price.toFixed(2)}€</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
