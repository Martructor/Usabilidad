import { Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProximityFilterProps {
  selected: number | null;
  onSelect: (distance: number | null) => void;
}

const distances = [
  { label: 'Todas', value: null },
  { label: 'Menos de 1 km', value: 1 },
  { label: 'Menos de 3 km', value: 3 },
  { label: 'Menos de 5 km', value: 5 },
  { label: 'Menos de 10 km', value: 10 }
];

export function ProximityFilter({ selected, onSelect }: ProximityFilterProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const currentIndex = distances.findIndex(d => d.value === selected);
  
  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    onSelect(distances[newIndex].value);
  };

  const handleNext = () => {
    const newIndex = Math.min(distances.length - 1, currentIndex + 1);
    onSelect(distances[newIndex].value);
  };

  // Versión desktop con flechas mostrando 3 opciones
  if (isDesktop) {
    // Calcular índices para mostrar 3 opciones centradas en la selección actual
    const centerIndex = currentIndex >= 0 ? currentIndex : 0;
    
    // Calcular el rango para mostrar 3 elementos centrados
    let startIndex = Math.max(0, centerIndex - 1);
    let endIndex = Math.min(distances.length - 1, startIndex + 2);
    
    // Ajustar si estamos cerca del final
    if (endIndex - startIndex < 2) {
      startIndex = Math.max(0, endIndex - 2);
    }
    
    const visibleDistances = distances.slice(startIndex, endIndex + 1);
    
    return (
      <div className="flex items-center justify-center gap-4">
        <Navigation className="w-5 h-5 text-gray-400 flex-shrink-0" />
        
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full transition-colors ${
            currentIndex === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-green-600 hover:bg-green-50'
          }`}
          title="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-3">
          {visibleDistances.map((distance, idx) => {
            const isSelected = distance.value === selected;
            const actualIndex = startIndex + idx;
            
            return (
              <button
                key={distance.label}
                onClick={() => onSelect(distance.value)}
                className={`px-5 py-2 rounded-full whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-green-500 text-white font-medium shadow-md scale-105'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {distance.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === distances.length - 1}
          className={`p-2 rounded-full transition-colors ${
            currentIndex === distances.length - 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-green-600 hover:bg-green-50'
          }`}
          title="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    );
  }

  // Versión móvil con botones
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <Navigation className="w-5 h-5 text-gray-400 flex-shrink-0" />
      <div className="flex gap-2">
        {distances.map((distance) => (
          <button
            key={distance.label}
            onClick={() => onSelect(distance.value)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selected === distance.value
                ? 'bg-green-500 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {distance.label}
          </button>
        ))}
      </div>
    </div>
  );
}
