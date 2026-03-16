import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};

export const AccessibilityProvider = ({ children }) => {
    // Try to load from localStorage or set defaults
    const [textSize, setTextSize] = useState(() => {
        return localStorage.getItem('textSize') || 'normal';
    });

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'default';
    });

    // Apply visual changes when state updates
    useEffect(() => {
        localStorage.setItem('textSize', textSize);
        document.documentElement.setAttribute('data-text-size', textSize);
    }, [textSize]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <AccessibilityContext.Provider value={{ textSize, setTextSize, theme, setTheme }}>
            {children}
        </AccessibilityContext.Provider>
    );
};
