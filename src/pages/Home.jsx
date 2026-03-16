import React from 'react';
import Header from '../components/Header';
import FilterChips from '../components/FilterChips';
import ProductCard from '../components/ProductCard';
import FloatingActions from '../components/FloatingActions';

const products = [
    {
        id: '1',
        title: 'Paracetamol 1g',
        category: 'Analgésicos',
        img: 'https://images.unsplash.com/photo-1584308666744-24d5e1f0e8f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        distance: 'A 0.5 km de distancia',
        store: 'Farmacia Central',
        location: 'Madrid Centro'
    },
    {
        id: '2',
        title: 'Ibuprofeno 600mg',
        category: 'Antiinflamatorios',
        img: 'https://images.unsplash.com/photo-1550572017-edb9cf122949?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        distance: 'A 2.3 km de distancia',
        store: 'Farmacia del Borne',
        location: 'Barcelona'
    },
    {
        id: '3',
        title: 'Termómetro Digital',
        category: 'Accesorios Médicos',
        img: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        distance: 'A 4.1 km de distancia',
        store: 'Farmacia Gran Vía',
        location: 'Madrid Sur'
    }
];

export default function Home() {
    return (
        <div style={{ paddingBottom: '120px' }}>
            <Header />
            <FilterChips />

            <main style={{ padding: '10px 20px' }}>
                <p style={{ fontSize: 'var(--font-md)', color: 'var(--primary-green)', marginBottom: '16px', fontWeight: '600' }}>
                    {products.length} productos encontrados
                </p>

                {products.map(p => (
                    <ProductCard key={p.id} {...p} />
                ))}
            </main>

            <FloatingActions />
        </div>
    );
}
