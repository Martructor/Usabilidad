import React, { useState } from 'react';

export default function FilterChips() {
    const [activeChip, setActiveChip] = useState('Todas');
    const filters = ['Todas', 'Menos de 1 km', 'Menos de 3 km', 'Farmacias 24h'];

    return (
        <nav aria-label="Filtros de búsqueda" style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '12px',
            padding: '20px 20px 10px 20px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
        }}>
            <style>{`nav::-webkit-scrollbar { display: none; }`}</style>

            {filters.map((filter) => {
                const isActive = activeChip === filter;
                return (
                    <button
                        key={filter}
                        onClick={() => setActiveChip(filter)}
                        style={{
                            padding: '10px 18px',
                            borderRadius: 'var(--border-radius-btn)',
                            fontSize: 'var(--font-sm)',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            backgroundColor: isActive ? 'var(--primary-green)' : 'var(--chip-inactive-bg)',
                            color: isActive ? 'white' : 'var(--primary-green)',
                            boxShadow: isActive ? '0 4px 8px rgba(0,177,64,0.3)' : 'none'
                        }}
                    >
                        {filter}
                    </button>
                );
            })}
        </nav>
    );
}
