import React from 'react';
import Header from '../components/Header';
import { useAccessibility } from '../context/AccessibilityContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const { textSize, setTextSize, theme, setTheme } = useAccessibility();
    const navigate = useNavigate();

    return (
        <div>
            <Header title="Configuración" showSearch={false} onBack={() => navigate(-1)} />

            <div style={{ padding: '24px 20px' }}>
                <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: '700', marginBottom: '24px' }}>Accesibilidad</h2>

                <div style={{ backgroundColor: 'white', borderRadius: 'var(--border-radius-card)', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ fontSize: 'var(--font-lg)', marginBottom: '16px' }}>Tamaño del Texto</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {['normal', 'large', 'extra-large'].map((size) => (
                            <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--font-md)', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="textSize"
                                    value={size}
                                    checked={textSize === size}
                                    onChange={(e) => setTextSize(e.target.value)}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary-green)' }}
                                />
                                <span style={{ textTransform: 'capitalize' }}>
                                    {size === 'normal' ? 'Normal' : size === 'large' ? 'Grande' : 'Muy Grande'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: 'var(--border-radius-card)', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ fontSize: 'var(--font-lg)', marginBottom: '16px' }}>Tema de Color</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { id: 'default', label: 'Verde Original (Por defecto)' },
                            { id: 'high-contrast', label: 'Alto Contraste (Blanco/Negro)' }
                        ].map((t) => (
                            <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--font-md)', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="theme"
                                    value={t.id}
                                    checked={theme === t.id}
                                    onChange={(e) => setTheme(e.target.value)}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary-green)' }}
                                />
                                <span>{t.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
