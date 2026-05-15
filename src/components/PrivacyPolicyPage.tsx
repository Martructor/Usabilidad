import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-gradient-to-r from-green-500 to-green-600 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={onBack} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white flex-1 text-center text-lg">Política de privacidad</h1>
          <div className="w-10"></div>
        </div>
      </header>
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-gray-700 text-sm leading-relaxed space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Política de privacidad</h2>
          <p>Esta es la Política de Privacidad de El Boticario.</p>
          <p>Recopilamos su información personal para proporcionarle nuestros servicios de búsqueda de farmacias y mantenerle informado sobre nuestros productos y ofertas.</p>
          <p>No compartimos su información con terceros sin su consentimiento explícito, salvo cuando sea requerido por la ley aplicable.</p>
          <p>Los datos se almacenan de forma segura y puede solicitar su eliminación desde la sección de configuración de su perfil.</p>
        </div>
      </div>
    </div>
  );
}
