import React, { useState } from 'react';
import { Heart, MapPin, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ id, title, category, img, distance, store, location }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    return (
        <article
            onClick={() => navigate(`/product/${id}`)}
            style={{
                background: 'var(--card-bg)',
                borderRadius: 'var(--border-radius-card)',
                overflow: 'hidden',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, boxShadow 0.3s ease'
            }}>

            <div style={{ position: 'relative', height: '220px', width: '100%', backgroundColor: '#F8F9FA' }}>
                <img
                    src={img}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <button
                    onClick={handleFavoriteClick}
                    aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        width: '40px', height: '40px',
                        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        color: isFavorite ? 'var(--error-color)' : 'var(--text-gray)',
                        transition: 'transform 0.2s',
                        zIndex: 10
                    }}>
                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
            </div>

            <div style={{ padding: '20px' }}>
                <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: '700', marginBottom: '6px', color: 'var(--text-dark)' }}>
                    {title}
                </h2>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--primary-green)', marginBottom: '16px', fontWeight: '600' }}>
                    {category}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: 'var(--font-sm)', color: 'var(--text-gray)', fontWeight: '500' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={16} color="var(--text-light-green)" /> {location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Store size={16} color="var(--text-light-green)" /> {store}
                        </span>
                    </div>
                    <p style={{ color: 'var(--primary-green)', fontSize: 'var(--font-sm)', fontWeight: '600', marginTop: '6px' }}>
                        {distance}
                    </p>
                </div>
            </div>
        </article>
    );
}
