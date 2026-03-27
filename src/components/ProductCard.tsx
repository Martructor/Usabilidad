import { MapPin, Store, Heart } from 'lucide-react';
import { Product } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ProductCard({ product, onClick, isFavorite, onToggleFavorite }: ProductCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-green-100 hover:shadow-md transition-shadow hover:border-green-200 cursor-pointer relative"
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${
            isFavorite 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-400 hover:text-red-500'
          }`}
        />
      </button>

      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-green-600">{product.category}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-3 pt-3 border-t border-green-50">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-green-500" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Store className="w-4 h-4 text-green-500" />
            <span>{product.seller}</span>
          </div>
        </div>
        {product.distance !== undefined && (
          <div className="mt-2 text-xs text-green-600">
            A {product.distance} km de distancia
          </div>
        )}
      </div>
    </div>
  );
}