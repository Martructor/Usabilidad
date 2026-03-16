import React from 'react';
import { MapPin, Sun, Moon, Search } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ showSearch = true, title = "El Boticario", onBack = null }) {
    const { theme, setTheme } = useAccessibility();
    const navigate = useNavigate();
    const location = useLocation();

    const toggleTheme = () => {
        setTheme(theme === 'default' ? 'high-contrast' : 'default');
    };

    return (
        <header style={{
            backgroundColor: 'var(--primary-green)',
            color: 'white',
            padding: '24px 20px',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showSearch ? '24px' : '0' }}>

                {onBack ? (
                    <button onClick={onBack} aria-label="Volver" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        ← Volver
                    </button>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-sm)', fontWeight: '600' }}>
                        <MapPin size={18} />
                        <span>Madrid</span>
                    </div>
                )}

                <h1 style={{ fontSize: 'var(--font-lg)', fontWeight: '700', margin: 0 }}>{title}</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={toggleTheme} aria-label="Cambiar Tema" style={{ transition: 'transform 0.3s' }}>
                        {theme === 'default' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    {!onBack && (
                        <button
                            onClick={() => navigate('/settings')}
                            style={{
                                backgroundColor: 'white',
                                color: 'var(--primary-green)',
                                borderRadius: 'var(--border-radius-btn)',
                                padding: '8px 16px',
                                fontSize: 'var(--font-sm)',
                                fontWeight: '600'
                            }}>
                            Ajustes
                        </button>
                    )}
                </div>
            </div>

            {showSearch && (
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'white' }} />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        aria-label="Buscar productos"
                        style={{
                            width: '100%',
                            padding: '14px 16px 14px 44px',
                            borderRadius: 'var(--border-radius-btn)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            background: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            fontSize: 'var(--font-md)',
                            outline: 'none'
                        }}
                    />
                </div>
            )}
        </header>
    );
}
