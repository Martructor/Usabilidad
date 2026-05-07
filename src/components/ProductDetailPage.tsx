import { ArrowLeft, Tag, Heart, Plus, X, Map, Star, Send, MapPin, Phone, Clock, User } from 'lucide-react';
import { Product, ProductLocation } from '../types';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  favoriteLocationIds: string[];
  onToggleFavoriteLocation: (locationId: string) => void;
  userCoords?: {lat: number; lng: number} | null;
  currentLocation?: string;
}

interface PharmacyReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface LocationWithRating extends ProductLocation {
  rating: number;
  reviews: PharmacyReview[];
}

export function ProductDetailPage({ product, onBack, favoriteLocationIds, onToggleFavoriteLocation, userCoords, currentLocation }: ProductDetailPageProps) {
  const [showAddLocationForm, setShowAddLocationForm] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<LocationWithRating | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const [locations, setLocations] = useState<LocationWithRating[]>(() => {
    const baseLocations = product.locations?.map((loc, idx) => {
      let calcDistance = loc.distance;
      if (userCoords && loc.lat && loc.lng) {
         calcDistance = Number(calculateDistance(userCoords.lat, userCoords.lng, loc.lat, loc.lng).toFixed(1));
      } else if (!userCoords) {
         calcDistance = undefined;
      }
      return {
        ...loc,
        distance: calcDistance,
        rating: 4.5 - (idx * 0.3),
        reviews: [
          {
            id: '1',
            userName: 'María García',
            rating: 5,
            comment: 'Excelente atención y servicio rápido.',
            date: '15/02/2026'
          },
          {
            id: '2',
            userName: 'Juan Pérez',
            rating: 4,
            comment: 'Buen precio y ubicación conveniente.',
            date: '10/02/2026'
          }
        ]
      };
    }) || [
      {
        id: '1',
        location: product.location,
        seller: product.seller,
        distance: userCoords ? product.distance : undefined,
        price: product.price,
        rating: 4.5,
        reviews: [
          {
            id: '1',
            userName: 'María García',
            rating: 5,
            comment: 'Excelente atención y servicio rápido.',
            date: '15/02/2026'
          },
          {
            id: '2',
            userName: 'Juan Pérez',
            rating: 4,
            comment: 'Buen precio y ubicación conveniente.',
            date: '10/02/2026'
          }
        ]
      }
    ];

    if (userCoords) {
      baseLocations.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    } else if (currentLocation) {
      baseLocations.sort((a, b) => {
        if (a.location === currentLocation && b.location !== currentLocation) return -1;
        if (b.location === currentLocation && a.location !== currentLocation) return 1;
        return 0;
      });
    }

    return baseLocations;
  });

  const [newLocation, setNewLocation] = useState({
    location: '',
    seller: '',
    price: ''
  });

  const handleAddLocation = async () => {
    if (!newLocation.location || !newLocation.seller || !newLocation.price) {
      toast.error('Por favor, rellena todos los campos obligatorios');
      return;
    }

    setIsAddingLocation(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/products/${product.id}/pharmacies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLocation.seller,
          location: newLocation.location,
          address: '',
          price: parseFloat(newLocation.price)
        }),
      });

      if (!response.ok) {
        throw new Error('Error al añadir la ubicación');
      }

      const location: LocationWithRating = {
        id: Date.now().toString(),
        location: newLocation.location,
        seller: newLocation.seller,
        distance: 0,
        price: parseFloat(newLocation.price),
        rating: 0,
        reviews: []
      };

      setLocations([...locations, location]);
      setNewLocation({ location: '', seller: '', price: '' });
      setShowAddLocationForm(false);
      toast.success('Ubicación añadida a la base de datos');
    } catch (error) {
      console.error(error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setIsAddingLocation(false);
    }
  };

  const handleAddComment = () => {
    if (!selectedPharmacy || !newComment.trim()) return;

    const newReview: PharmacyReview = {
      id: Date.now().toString(),
      userName: 'Usuario Actual',
      rating: newRating,
      comment: newComment,
      date: new Date().toLocaleDateString('es-ES')
    };

    const updatedLocations = locations.map(loc => {
      if (loc.id === selectedPharmacy.id) {
        const updatedReviews = [...loc.reviews, newReview];
        const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...loc,
          reviews: updatedReviews,
          rating: avgRating
        };
      }
      return loc;
    });

    setLocations(updatedLocations);
    const updatedPharmacy = updatedLocations.find(loc => loc.id === selectedPharmacy.id);
    if (updatedPharmacy) {
      setSelectedPharmacy(updatedPharmacy);
    }
    setNewComment('');
    setNewRating(5);
  };

  const renderStars = (rating: number, size: string = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-50 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-green-600 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white flex-1 text-center">Detalle del Producto</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto">
        {/* Imagen del producto */}
        <div className="bg-white">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover"
          />
        </div>

        {/* Información del producto */}
        <div className="bg-white mt-2 p-6 rounded-t-3xl -mt-6 relative z-10">
          <div className="mb-4">
            <h2 className="text-gray-900 mb-2">{product.name}</h2>
          </div>

          {/* Categoría */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
            <Tag className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-700">{product.category}</span>
          </div>

          {/* Tabla de Ubicaciones */}
          <div className="mb-4">
            <h3 className="text-gray-900 mb-3">Disponibilidad</h3>
            
            {/* Tabla */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1.2fr_1.5fr_0.8fr_auto_auto] bg-green-50 text-xs font-medium text-gray-700 border-b border-gray-200">
                <div className="p-3 border-r border-gray-200">Ciudad</div>
                <div className="p-3 border-r border-gray-200">Farmacia</div>
                <div className="p-3 border-r border-gray-200">Precio</div>
                <div className="p-3 border-r border-gray-200 w-12 text-center"></div>
                <div className="p-3 w-20">Valoración</div>
              </div>

              {/* Rows */}
              {locations.map((loc) => (
                <div key={loc.id} className="grid grid-cols-[1.2fr_1.5fr_0.8fr_auto_auto] text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <div className="p-3 border-r border-gray-100 text-gray-900 text-xs">{loc.location}</div>
                  <div 
                    className="p-3 border-r border-gray-100 text-green-600 text-xs truncate cursor-pointer hover:text-green-700 hover:underline"
                    onClick={() => setSelectedPharmacy(loc)}
                  >
                    {loc.seller}
                  </div>
                  <div className="p-3 border-r border-gray-100 font-semibold text-green-600 text-xs">{loc.price.toFixed(2)}€</div>
                  <div className="p-2 flex items-center justify-center border-r border-gray-100">
                    <button
                      onClick={() => onToggleFavoriteLocation(loc.id)}
                      className={`hover:bg-green-50 rounded p-1 transition-colors ${
                        favoriteLocationIds.includes(loc.id) ? 'text-red-500' : 'text-gray-400'
                      }`}
                      title={favoriteLocationIds.includes(loc.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    >
                      <Heart className={`w-6 h-6 ${favoriteLocationIds.includes(loc.id) ? 'fill-red-500' : ''}`} />
                    </button>
                  </div>
                  <div className="p-2 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-0.5">
                      {renderStars(loc.rating, "w-3 h-3")}
                      <span className="text-xs text-gray-600">{loc.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Location Button */}
            {!showAddLocationForm && (
              <button
                onClick={() => setShowAddLocationForm(true)}
                className="w-full mt-3 py-3 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Añadir ubicación</span>
              </button>
            )}

            {/* Add Location Form */}
            {showAddLocationForm && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 text-sm">Nueva ubicación</h4>
                  <button
                    onClick={() => setShowAddLocationForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Ciudad (ej: Madrid)"
                    value={newLocation.location}
                    onChange={(e) => setNewLocation({ ...newLocation, location: e.target.value })}
                    className="w-full p-2 text-sm bg-white rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Nombre de farmacia"
                    value={newLocation.seller}
                    onChange={(e) => setNewLocation({ ...newLocation, seller: e.target.value })}
                    className="w-full p-2 text-sm bg-white rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Precio (€)"
                    value={newLocation.price}
                    onChange={(e) => setNewLocation({ ...newLocation, price: e.target.value })}
                    className="w-full p-2 text-sm bg-white rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    step="0.01"
                  />
                  <button
                    onClick={handleAddLocation}
                    disabled={isAddingLocation}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isAddingLocation ? 'Añadiendo...' : 'Añadir'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-gray-900 mb-3">Descripción</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.name} disponible en múltiples farmacias. 
              Producto de calidad farmacéutica con las mejores garantías. 
              Consulte con su farmacéutico para más información sobre su uso y dosis recomendada.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 space-y-3">
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
              Contactar farmacia
            </button>
            <button className="w-full border-2 border-green-600 text-green-600 py-4 rounded-xl hover:bg-green-50 transition-all">
              Ver en mapa
            </button>
          </div>

          {/* Aviso legal */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-xs text-green-800">
              <strong>Aviso:</strong> Los precios y disponibilidad están sujetos a cambios. 
              Consulte directamente con la farmacia para confirmar la información actualizada.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Detallado de Farmacia */}
      {selectedPharmacy && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setSelectedPharmacy(null)}
        >
          <div 
            className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium">{selectedPharmacy.seller}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-white/90" />
                    <p className="text-white/90 text-sm">{selectedPharmacy.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPharmacy(null)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto">
              {/* Info rápida */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      {renderStars(selectedPharmacy.rating)}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{selectedPharmacy.rating.toFixed(1)}</p>
                    <p className="text-xs text-gray-600">Valoración</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-600 mb-1">{selectedPharmacy.price.toFixed(2)}€</p>
                    <p className="text-xs text-gray-600">Precio</p>
                  </div>
                  <div>
                    {selectedPharmacy.distance !== undefined ? (
                      <>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{selectedPharmacy.distance} km</p>
                        <p className="text-xs text-gray-600">Distancia</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-gray-900 mb-1">--</p>
                        <p className="text-xs text-gray-600">Distancia</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onToggleFavoriteLocation(selectedPharmacy.id)}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      favoriteLocationIds.includes(selectedPharmacy.id)
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favoriteLocationIds.includes(selectedPharmacy.id) ? 'fill-red-500' : ''}`} />
                    <span className="text-sm">{favoriteLocationIds.includes(selectedPharmacy.id) ? 'Guardado' : 'Guardar'}</span>
                  </button>
                  <button className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Llamar</span>
                  </button>
                </div>
              </div>

              {/* Mapa */}
              <div className="relative w-full h-60 border-b border-gray-200">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(selectedPharmacy.seller + ', ' + selectedPharmacy.location + ', España')}&zoom=15`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Horarios */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-gray-900">Horario</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lunes - Viernes</span>
                    <span className="text-gray-900 font-medium">9:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sábados</span>
                    <span className="text-gray-900 font-medium">10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domingos</span>
                    <span className="text-red-600 font-medium">Cerrado</span>
                  </div>
                </div>
              </div>

              {/* Comentarios */}
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-4">Comentarios ({selectedPharmacy.reviews.length})</h4>
                
                {/* Lista de comentarios */}
                <div className="space-y-4 mb-4">
                  {selectedPharmacy.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{review.userName}</span>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          <div className="mb-2">
                            {renderStars(review.rating, "w-3 h-3")}
                          </div>
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulario para añadir comentario */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Añadir comentario</h5>
                  
                  {/* Selector de estrellas */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">Tu valoración:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Campo de texto */}
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu opinión..."
                    className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                    rows={3}
                  />

                  {/* Botón enviar */}
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="w-full mt-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publicar comentario</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer con botón de navegación */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
              <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <Map className="w-5 h-5" />
                <span>Cómo llegar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
