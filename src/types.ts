export interface ProductLocation {
  id: string;
  location: string;
  seller: string;
  distance?: number;
  price: number;
  lat?: number;
  lng?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number; // Precio mínimo para mostrar en tarjetas
  location: string; // Ubicación principal para mostrar en tarjetas
  category: string;
  image: string;
  seller: string; // Farmacia principal para mostrar en tarjetas
  pharmacyId?: string; // ID de la farmacia principal
  distance?: number; // Distancia mínima para mostrar en tarjetas
  locations?: ProductLocation[]; // Array de ubicaciones/farmacias con el producto
}