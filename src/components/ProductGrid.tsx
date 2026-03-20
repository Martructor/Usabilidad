import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  favoriteIds: string[];
  onToggleFavorite: (productId: string) => void;
}

export function ProductGrid({ products, onProductClick, favoriteIds, onToggleFavorite }: ProductGridProps) {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onClick={() => onProductClick(product)}
          isFavorite={favoriteIds.includes(product.id)}
          onToggleFavorite={() => onToggleFavorite(product.id)}
        />
      ))}
    </div>
  );
}