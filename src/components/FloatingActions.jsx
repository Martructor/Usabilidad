import React from 'react';
import { Heart, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingActions() {
    const navigate = useNavigate();

    const fabStyle = {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'white',
        border: '1.5px solid var(--primary-green)',
        color: 'var(--primary-green)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,177,64,0.15)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    };

    const primaryFabStyle = {
        ...fabStyle,
        width: '64px',
        height: '64px',
        backgroundColor: 'var(--primary-green)',
        color: 'white',
        border: 'none',
        boxShadow: '0 6px 16px rgba(0,177,64,0.3)',
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: 'calc(50% - 187px)', /* Keep it inside the 414px container on desktop */
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
            zIndex: 100
        }}>
            {/* Small responsive offset for smaller screens */}
            <style>{`
        @media (max-width: 414px) {
          div[style*="calc"] { right: 20px !important; }
        }
      `}</style>

            <button style={fabStyle} aria-label="Lista de deseos">
                <Heart size={20} />
            </button>
            <button
                style={fabStyle}
                aria-label="Ajustes de accesibilidad"
                onClick={() => navigate('/settings')}
            >
                <Settings size={20} />
            </button>
            <button style={primaryFabStyle} aria-label="Nuevo registro">
                <Plus size={28} />
            </button>
        </div>
    );
}
