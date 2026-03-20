import { useState } from 'react';
import { ArrowLeft, Package, Image as ImageIcon, Weight, Tag, MapPin, Building2 } from 'lucide-react';

interface AddProductPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AddProductPage({ onBack, onSuccess }: AddProductPageProps) {
  const [productName, setProductName] = useState('');
  const [image, setImage] = useState('');
  const [weight, setWeight] = useState('');
  const [productType, setProductType] = useState('');
  const [location, setLocation] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el producto
    console.log({
      productName,
      image,
      weight,
      productType,
      location,
      pharmacyName,
      price
    });
    onSuccess();
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
          <h1 className="text-white flex-1 text-center">Subir Producto</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-gray-900 mb-2">Nuevo Producto</h2>
            <p className="text-sm text-gray-600">Completa la información del producto</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="productName" className="block text-sm text-gray-700 mb-2">
                Nombre del producto
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ej: Paracetamol 1g"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm text-gray-700 mb-2">
                URL de la imagen
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm text-gray-700 mb-2">
                Peso por unidad
              </label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ej: 500mg, 1g, 100ml"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm text-gray-700 mb-2">
                Precio (€)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="productType" className="block text-sm text-gray-700 mb-2">
                Tipo de producto
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="productType"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Analgésicos">Analgésicos</option>
                  <option value="Antiinflamatorios">Antiinflamatorios</option>
                  <option value="Vitaminas y Suplementos">Vitaminas y Suplementos</option>
                  <option value="Material Sanitario">Material Sanitario</option>
                  <option value="Digestivos">Digestivos</option>
                  <option value="Dermofarmacia">Dermofarmacia</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm text-gray-700 mb-2">
                Localidad
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Selecciona una localidad</option>
                  <option value="Madrid">Madrid</option>
                  <option value="Barcelona">Barcelona</option>
                  <option value="Valencia">Valencia</option>
                  <option value="Sevilla">Sevilla</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="pharmacyName" className="block text-sm text-gray-700 mb-2">
                Nombre de la farmacia
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="pharmacyName"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  placeholder="Ej: Farmacia Central"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
            >
              Publicar Producto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
