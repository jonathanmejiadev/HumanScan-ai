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
    text: '¡Hola! Soy HealthAI, tu asistente virtual. Puedo ayudarte con dudas de salud o identificar qué tipo de escaneo necesitas. ¿En qué puedo ayudarte hoy?',
    sender: 'ai',
    timestamp: Date.now(),
};

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

interface ContentPart {
    text: string;
}

interface Content {
    role: 'user' | 'model';
    parts: ContentPart[];
}

const SYSTEM_INSTRUCTION_TEXT = 'Eres HealthAI, asistente de "Usuario Logueado". Responde dudas de salud general (ej. dolor de cabeza, fiebre, consejos de bienestar) con empatía. Si el usuario menciona algo que requiera un escaneo visual, usa las etiquetas [ACTION:skin], [ACTION:ocular], [ACTION:dental], [ACTION:nails], [ACTION:posture], [ACTION:wound]. No eres médico, así que añade siempre un aviso legal breve.';

let chatHistory: Content[] = [];

export const AIService = {
    getInitialGreeting: (): ChatMessage => INITIAL_GREETING,

    startNewSession: () => {
        chatHistory = [];
    },

    sendMessage: async (text: string): Promise<ChatMessage> => {
        if (!API_KEY) return AIService.fallbackLogic(text);

        const userMsg: Content = { role: 'user', parts: [{ text: text.trim() }] };
        const historyToSend = [...chatHistory, userMsg].filter(m => m.parts[0].text.trim().length > 0);

        let aiResponseText = '';

        try {
            // URL Exacta que funciona en AnalysisService
            const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + API_KEY;

            const payload = {
                contents: [
                    // Inyectamos System Prompt como historial falso (Técnica probada)
                    {
                        role: "user",
                        parts: [{ text: "SYSTEM INSTRUCTIONS: " + SYSTEM_INSTRUCTION_TEXT }]
                    },
                    {
                        role: "model",
                        parts: [{ text: "Entendido. Actuaré como HealthAI siguiendo tus instrucciones estrictamente." }]
                    },
                    ...historyToSend
                ],
                // Ajustes de seguridad mínimos para permitir conversaciones médicas
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
                ]
            };

            console.log('[HealthAI] Conectando a Gemini (Flash Latest)...');

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                // Si falla Flash, intentamos Pro
                console.warn('[HealthAI] Fallo Flash, intentando Pro. Error:', errorText);

                const urlPro = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY;
                const responsePro = await fetch(urlPro, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!responsePro.ok) {
                    throw new Error("API Error Pro: " + await responsePro.text());
                }

                const dataPro = await responsePro.json();
                aiResponseText = dataPro.candidates?.[0]?.content?.parts?.[0]?.text || '';

            } else {
                const data = await response.json();
                aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            }

            if (!aiResponseText) throw new Error('Respuesta vacía');

            // Limpiar respuesta de markdown si es necesario
            aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();

            chatHistory.push(userMsg);
            chatHistory.push({ role: 'model', parts: [{ text: aiResponseText }] });

            const { cleanText, relatedModule } = AIService.parseResponse(aiResponseText);

            return {
                id: Date.now().toString(),
                text: cleanText,
                sender: 'ai',
                timestamp: Date.now(),
                relatedModule,
            };

        } catch (error) {
            console.error('[HealthAI] Fallo Fatal API:', error);
            return AIService.fallbackLogic(text);
        }
    },

    parseResponse: (text: string) => {
        let cleanText = text;
        let relatedModule: ScanType | undefined;
        const actionMatch = text.match(/\[ACTION:(\w+)\]/);

        if (actionMatch) {
            const actionType = actionMatch[1];
            cleanText = text.replace(/\[ACTION:\w+\]/, '').trim();
            if (['skin', 'ocular', 'dental', 'nails', 'posture', 'wound'].includes(actionType)) {
                relatedModule = actionType as ScanType;
            }
        }
        return { cleanText, relatedModule };
    },

    fallbackLogic: (text: string): ChatMessage => {
        let responseText = '';
        let relatedModule: ScanType | undefined;
        const lowerText = text.toLowerCase();

        if (lowerText.includes('piel') || lowerText.includes('mancha') || lowerText.includes('lunar')) {
            responseText = 'Para analizar manchas, lunares o irritaciones en la piel, te recomiendo usar el escáner Dermatológico.';
            relatedModule = 'skin';
        } else if (lowerText.includes('ojo') || lowerText.includes('visión') || lowerText.includes('rojo')) {
            responseText = 'Para problemas oculares visibles, usa nuestro escáner Ocular.';
            relatedModule = 'ocular';
        } else if (lowerText.includes('diente') || lowerText.includes('boca') || lowerText.includes('encía')) {
            responseText = 'Para salud bucal, usa el escáner Dental.';
            relatedModule = 'dental';
        } else if (lowerText.includes('uña') || lowerText.includes('hongo')) {
            responseText = 'Para analizar uñas, usa el escáner de Uñas.';
            relatedModule = 'nails';
        } else if (lowerText.includes('postura') || lowerText.includes('espalda') || lowerText.includes('dolor')) {
            responseText = 'El módulo de Postura te ayuda a evaluar tu alineación.';
            relatedModule = 'posture';
        } else if (lowerText.includes('herida') || lowerText.includes('corte')) {
            responseText = 'Usa el módulo de Heridas para seguimiento.';
            relatedModule = 'wound';
        } else {
            responseText = 'Entiendo. Como estoy en modo offline, te sugiero descansar e hidratarte. Si tienes un problema visual, elige un escáner del menú.';
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
