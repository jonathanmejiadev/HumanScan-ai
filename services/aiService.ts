import { ScanType } from '@/types/analysis';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: number;
    relatedModule?: ScanType;
}

const INITIAL_GREETING: ChatMessage = {
    id: 'init-1',
    text: '¡Hola! Soy HealthAI, tu asistente virtual. Puedo ayudarte a identificar qué tipo de escaneo necesitas o responder dudas básicas sobre el uso de la app. ¿En qué puedo ayudarte hoy?',
    sender: 'ai',
    timestamp: Date.now(),
};

export const AIService = {
    getInitialGreeting: (): ChatMessage => INITIAL_GREETING,

    sendMessage: async (text: string): Promise<ChatMessage> => {
        // Simular delay de red/procesamiento
        await new Promise(resolve => setTimeout(resolve, 1500));

        let responseText = '';
        let relatedModule: ScanType | undefined;

        const lowerText = text.toLowerCase();

        if (lowerText.includes('piel') || lowerText.includes('mancha') || lowerText.includes('lunar')) {
            responseText = 'Para analizar manchas, lunares o irritaciones en la piel, te recomiendo usar el escáner Dermatológico. Utiliza el protocolo ABCDE para un análisis detallado.';
            relatedModule = 'skin';
        } else if (lowerText.includes('ojo') || lowerText.includes('visión') || lowerText.includes('rojo')) {
            responseText = 'Si tienes molestias en los ojos, enrojecimiento o cambios en la visión, nuestro módulo Ocular puede ayudarte a capturar imágenes claras para un seguimiento.';
            relatedModule = 'ocular';
        } else if (lowerText.includes('diente') || lowerText.includes('boca') || lowerText.includes('encía')) {
            responseText = 'Para problemas bucodentales, selecciona el escáner Dental. Asegúrate de tener buena iluminación para capturar los detalles.';
            relatedModule = 'dental';
        } else if (lowerText.includes('uña') || lowerText.includes('hongo') || lowerText.includes('dedo')) {
            responseText = 'El módulo de Uñas está diseñado para analizar texturas y coloraciones que podrían indicar hongos u otras afecciones.';
            relatedModule = 'nails';
        } else if (lowerText.includes('postura') || lowerText.includes('espalda') || lowerText.includes('columna') || lowerText.includes('cuello') || lowerText.includes('dolor')) {
            responseText = 'Para evaluar tu alineación corporal y posibles desviaciones, el escáner de Postura es ideal. Necesitarás colocar el teléfono verticalmente y alejarte un poco.';
            relatedModule = 'posture';
        } else if (lowerText.includes('herida') || lowerText.includes('corte') || lowerText.includes('cicatriz') || lowerText.includes('sangre') || lowerText.includes('curación')) {
            responseText = 'El módulo de Heridas te permite llevar un registro fotográfico de la evolución de una lesión. Es muy útil para mostrar el progreso a tu médico.';
            relatedModule = 'wound';
        } else {
            responseText = 'Entiendo. Por el momento soy un asistente en entrenamiento y aprendo día a día. Te sugiero explorar nuestros escáneres especializados desde la pantalla de inicio (Piel, Ojos, Dientes, Postura, Uñas, Heridas) para encontrar la herramienta adecuada. ¿Hay algo más en lo que pueda orientarte?';
        }

        return {
            id: Date.now().toString(),
            text: responseText,
            sender: 'ai',
            timestamp: Date.now(),
            relatedModule,
        };
    }
};
