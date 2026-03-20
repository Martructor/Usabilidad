import { MapPin } from 'lucide-react';

interface LocationFilterProps {
  locations: string[];
  selected: string;
  onSelect: (location: string) => void;
}

export function LocationFilter({ locations, selected, onSelect }: LocationFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
      <div className="flex gap-2">
        {locations.map((location) => (
          <button
            key={location}
            onClick={() => onSelect(location)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selected === location
                ? 'bg-green-500 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {location}
          </button>
        ))}
      </div>
    </div>
  );
}