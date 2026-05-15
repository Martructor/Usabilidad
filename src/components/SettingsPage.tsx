import { ArrowLeft, Eye, Type, Palette, Globe, Shield, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface SettingsPageProps {
  onBack: () => void;
  onViewPrivacyPolicy: () => void;
  onViewTerms: () => void;
}

export function SettingsPage({ onBack, onViewPrivacyPolicy, onViewTerms }: SettingsPageProps) {
  const [screenReader, setScreenReader] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [colorTheme, setColorTheme] = useState('verde');
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    const savedScreenReader = localStorage.getItem('boticario_screen_reader') === 'true';
    const savedFontSize = localStorage.getItem('boticario_font_size') || 'normal';
    const savedColorTheme = localStorage.getItem('boticario_color_theme') || 'verde';
    const savedLanguage = localStorage.getItem('boticario_language') || 'es';

    setScreenReader(savedScreenReader);
    setFontSize(savedFontSize);
    setColorTheme(savedColorTheme);
    setLanguage(savedLanguage);
  }, []);

  const handleSaveSetting = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  const handleScreenReaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setScreenReader(checked);
    handleSaveSetting('boticario_screen_reader', checked.toString());
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFontSize(value);
    handleSaveSetting('boticario_font_size', value);
  };

  const handleColorThemeChange = (theme: string) => {
    setColorTheme(theme);
    handleSaveSetting('boticario_color_theme', theme);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLanguage(value);
    handleSaveSetting('boticario_language', value);
  };

  const resetSettings = () => {
    setScreenReader(false);
    setFontSize('normal');
    setColorTheme('verde');
    setLanguage('es');
    localStorage.removeItem('boticario_screen_reader');
    localStorage.removeItem('boticario_font_size');
    localStorage.removeItem('boticario_color_theme');
    localStorage.removeItem('boticario_language');
    toast.success('Configuración restaurada por defecto');
  };

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-gradient-to-r from-green-500 to-green-600 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white flex-1 text-center">Configuración</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="max-w-md mx-auto pb-8">
        {/* Accessibility Section */}
        <div className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-green-600" />
            <h3 className="text-gray-900">Accesibilidad</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium">Lector de pantalla</p>
                <p className="text-xs text-gray-500 mt-1">Mejora compatibilidad con lectores</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-3">
                <input type="checkbox" className="sr-only peer" checked={screenReader} onChange={handleScreenReaderChange} />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Font Size Section */}
        <div className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Type className="w-6 h-6 text-green-600" />
            <h3 className="text-gray-900">Tamaño de texto</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input type="radio" name="fontSize" value="normal" checked={fontSize === 'normal'} onChange={handleFontSizeChange} className="w-4 h-4 text-green-600 focus:ring-green-500" />
              <span className="ml-3 text-sm text-gray-700">Normal</span>
            </label>
            <label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input type="radio" name="fontSize" value="grande" checked={fontSize === 'grande'} onChange={handleFontSizeChange} className="w-4 h-4 text-green-600 focus:ring-green-500" />
              <span className="ml-3 text-base text-gray-700">Grande</span>
            </label>
            <label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input type="radio" name="fontSize" value="muy_grande" checked={fontSize === 'muy_grande'} onChange={handleFontSizeChange} className="w-4 h-4 text-green-600 focus:ring-green-500" />
              <span className="ml-3 text-lg text-gray-700">Muy grande</span>
            </label>
          </div>
        </div>

        {/* Color Theme Section */}
        <div className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-green-600" />
            <h3 className="text-gray-900">Tema de color</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => handleColorThemeChange('verde')} className={`p-4 rounded-lg text-white text-sm font-medium transition-shadow border-2 bg-gradient-to-br from-green-500 to-green-600 ${colorTheme === 'verde' ? 'border-green-700 shadow-md' : 'border-transparent hover:shadow-md'}`}>
              Verde
            </button>
            <button onClick={() => handleColorThemeChange('azul')} className={`p-4 rounded-lg text-white text-sm font-medium transition-shadow border-2 bg-gradient-to-br from-blue-500 to-blue-600 ${colorTheme === 'azul' ? 'border-blue-700 shadow-md' : 'border-transparent hover:shadow-md'}`}>
              Azul
            </button>
            <button onClick={() => handleColorThemeChange('morado')} className={`p-4 rounded-lg text-white text-sm font-medium transition-shadow border-2 bg-gradient-to-br from-purple-500 to-purple-600 ${colorTheme === 'morado' ? 'border-purple-700 shadow-md' : 'border-transparent hover:shadow-md'}`}>
              Morado
            </button>
          </div>
        </div>

        {/* Language Section */}
        <div className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-green-600" />
            <h3 className="text-gray-900">Idioma</h3>
          </div>

          <select value={language} onChange={handleLanguageChange} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="ca">Català</option>
            <option value="eu">Euskara</option>
            <option value="gl">Galego</option>
          </select>
        </div>

        {/* Privacy Section */}
        <div className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="text-gray-900">Privacidad y seguridad</h3>
          </div>

          <div className="space-y-3">
            <button onClick={onViewPrivacyPolicy} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">Política de privacidad</span>
              <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </button>

            <button onClick={onViewTerms} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">Términos y condiciones</span>
              <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-6 h-6 text-green-600" />
            <h3 className="text-gray-900">Acerca de</h3>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium text-gray-700">Versión:</span> 1.0.0</p>
            <p><span className="font-medium text-gray-700">Última actualización:</span> 14 de febrero, 2026</p>
            <button className="text-green-600 hover:underline mt-2">Ver registro de cambios</button>
          </div>
        </div>

        {/* Reset Settings */}
        <div className="mt-4 mx-4">
          <button onClick={resetSettings} className="w-full bg-white text-red-600 py-4 rounded-xl hover:bg-red-50 transition-all shadow-sm border border-red-200">
            Restaurar configuración predeterminada
          </button>
        </div>
      </div>
    </div>
  );
}
