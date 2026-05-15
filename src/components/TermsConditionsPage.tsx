import { ArrowLeft } from 'lucide-react';

interface TermsConditionsPageProps {
  onBack: () => void;
}

export function TermsConditionsPage({ onBack }: TermsConditionsPageProps) {
  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-gradient-to-r from-green-500 to-green-600 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={onBack} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white flex-1 text-center text-lg">Términos y condiciones</h1>
          <div className="w-10"></div>
        </div>
      </header>
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-gray-700 text-sm leading-relaxed space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Términos y condiciones</h2>
          <p>Estos son los Términos y Condiciones de uso de la aplicación El Boticario.</p>
          <p>Al utilizar nuestra aplicación y sus servicios, usted acepta cumplir y estar sujeto a estos términos y condiciones en su totalidad.</p>
          <p>El Boticario actúa como intermediario para mostrar información sobre precios y disponibilidad, pero no asume la responsabilidad de la exactitud de los datos que proveen las farmacias.</p>
          <p>Nos reservamos el derecho a modificar o reemplazar estos términos en cualquier momento. Se le notificará acerca de cualquier cambio significativo en nuestra plataforma.</p>
        </div>
      </div>
    </div>
  );
}
