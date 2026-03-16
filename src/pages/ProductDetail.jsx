import React, { useState } from 'react';
import Header from '../components/Header';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, Plus, MapPin, Info } from 'lucide-react';

const mockProduct = {
    id: '1',
    name: 'Paracetamol 1g',
    category: 'Analgésicos',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5e1f0e8f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'El paracetamol es un medicamento con propiedades analgésicas y antipiréticas. Se utiliza principalmente para el tratamiento sintomático de la fiebre y del dolor de intensidad leve a moderada.',
    availability: [
        { id: 101, city: 'Madrid Centro', pharmacy: 'Farmacia Central', price: '4.50€', rating: 4.8, comments: ['Excelente trato', 'Siempre tienen stock temporal'] },
        { id: 102, city: 'Barcelona', pharmacy: 'Farmacia del Borne', price: '4.75€', rating: 4.2, comments: ['A veces hay fila enorme', 'Medicamentos siempre vigentes'] },
        { id: 103, city: 'Valencia', pharmacy: 'Farmacia Ruzafa', price: '4.30€', rating: 5.0, comments: ['Muy amables, los recomiendo', 'Rápidos en atender'] },
    ]
};

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState(new Set());
    const [expandedComments, setExpandedComments] = useState(null);

    const toggleFavorite = (pharmacyId) => {
        setFavorites(prev => {
            const newFavs = new Set(prev);
            if (newFavs.has(pharmacyId)) {
                newFavs.delete(pharmacyId);
            } else {
                newFavs.add(pharmacyId);
            }
            return newFavs;
        });
    };

    const toggleComments = (pharmacyId) => {
        setExpandedComments(prev => prev === pharmacyId ? null : pharmacyId);
    };

    return (
        <div style={{ paddingBottom: '100px' }}>
            <Header title="Detalle" showSearch={false} onBack={() => navigate(-1)} />

            <div style={{ padding: '0 20px', marginTop: '20px' }}>
                {/* 1. Foto del producto */}
                <img
                    src={mockProduct.img}
                    alt={mockProduct.name}
                    style={{ width: '100%', borderRadius: 'var(--border-radius-card)', height: '240px', objectFit: 'cover' }}
                />

                {/* 2. Nombre y etiqueta de tipo */}
                <div style={{ marginTop: '24px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: '700', marginBottom: '8px' }}>{mockProduct.name}</h2>
                    <p style={{ color: 'var(--primary-green)', fontWeight: '600', fontSize: 'var(--font-sm)', display: 'inline-block', backgroundColor: 'var(--chip-inactive-bg)', padding: '6px 12px', borderRadius: '16px' }}>
                        {mockProduct.category}
                    </p>
                </div>

                {/* 3. Apartado de disponibilidad tabla */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: 'var(--font-xl)', marginBottom: '16px', fontWeight: '700' }}>Disponibilidad</h3>

                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--border-radius-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                        {/* Table Header */}
                        <div style={{ display: 'flex', borderBottom: '2px solid #f3f4f6', padding: '12px 16px', backgroundColor: '#f9fafb', fontSize: 'var(--font-sm)', color: 'var(--text-gray)', fontWeight: '600' }}>
                            <div style={{ flex: 2 }}>Farmacia / Ciudad</div>
                            <div style={{ flex: 1, textAlign: 'right' }}>Precio</div>
                            <div style={{ flex: 1, textAlign: 'center' }}>Acciones</div>
                        </div>

                        {mockProduct.availability.map((loc) => (
                            <React.Fragment key={loc.id}>
                                <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
                                    {/* Ciudad y Farmacia */}
                                    <div style={{ flex: 2 }}>
                                        <p style={{ fontWeight: '600', fontSize: 'var(--font-md)', color: 'var(--text-dark)' }}>{loc.pharmacy}</p>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-sm)', color: 'var(--text-gray)', marginTop: '4px' }}>
                                            <MapPin size={14} /> {loc.city}
                                        </p>
                                    </div>

                                    {/* Precio */}
                                    <div style={{ flex: 1, textAlign: 'right', fontWeight: '700', fontSize: 'var(--font-lg)', color: 'var(--primary-green)' }}>
                                        {loc.price}
                                    </div>

                                    {/* Acciones (Corazon y Valoracion) */}
                                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                                        <button
                                            onClick={() => toggleFavorite(loc.id)}
                                            aria-label="Añadir a favoritos"
                                            style={{ color: favorites.has(loc.id) ? 'var(--error-color)' : 'var(--text-gray)', transition: 'transform 0.2s' }}
                                        >
                                            <Heart size={22} fill={favorites.has(loc.id) ? 'currentColor' : 'none'} />
                                        </button>
                                        <button
                                            onClick={() => toggleComments(loc.id)}
                                            aria-label="Ver valoraciones"
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: 'var(--font-md)', fontWeight: '600' }}
                                        >
                                            {loc.rating} <Star size={18} fill="currentColor" />
                                        </button>
                                    </div>
                                </div>

                                {/* Comentarios Expansibles */}
                                {expandedComments === loc.id && (
                                    <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: 'var(--font-sm)' }}>
                                        <p style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--text-dark)' }}>Comentarios de usuarios:</p>
                                        <ul style={{ paddingLeft: '20px', color: 'var(--text-gray)', margin: 0 }}>
                                            {loc.comments.map((comment, i) => (
                                                <li key={i} style={{ marginBottom: '6px' }}>"{comment}"</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* 4. Botón + para añadir ubicación nueva */}
                    <button style={{
                        width: '100%', marginTop: '16px', padding: '16px', borderRadius: 'var(--border-radius-btn)',
                        backgroundColor: 'var(--chip-inactive-bg)', color: 'var(--primary-green)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                        fontSize: 'var(--font-md)', fontWeight: '600', border: '2px dashed var(--primary-green)',
                        transition: 'background-color 0.2s'
                    }}>
                        <Plus size={20} />
                        Añadir ubicación nueva
                    </button>
                </div>

                {/* 5. Apartado Descripción */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: 'var(--font-xl)', marginBottom: '12px', fontWeight: '700' }}>Descripción</h3>
                    <p style={{ fontSize: 'var(--font-md)', color: 'var(--text-gray)', lineHeight: '1.6' }}>
                        {mockProduct.description}
                    </p>
                </div>

                {/* 6. Aviso legal de precios */}
                <div style={{ display: 'flex', gap: '12px', padding: '16px', backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '8px', marginBottom: '40px' }}>
                    <Info size={24} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: 'var(--font-sm)', color: '#92400e', margin: 0, lineHeight: '1.5' }}>
                        <strong>Aviso:</strong> Todos los precios mostrados están sujetos a cambios sin previo aviso y dependen directamente del inventario local de cada establecimiento en el momento de la consulta.
                    </p>
                </div>

            </div>
        </div>
    );
}
