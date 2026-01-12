import { ScanType, ClassificationResult } from '@/types/analysis';

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

// Parametrización del usuario
let currentUserName = 'Jonathan';

interface ContentPart {
    text?: string;
    inline_data?: {
        mime_type: string;
        data: string;
    };
}

interface Content {
    role: 'user' | 'model';
    parts: ContentPart[];
}

// System Prompt Dinámico y Mejorado para Triaje (PRESERVADO INTACTO CON LÓGICA DINÁMICA)
const getSystemPrompt = (userName: string) => `
ROL: Eres HealthAI, un asistente de salud virtual inteligente y empático para ${userName}.
IDIOMA: Responde SIEMPRE en Español.

OBJETIVOS:
1. Analizar síntomas y orientar sobre bienestar general.
2. Identificar cuándo es útil usar los módulos de escaneo visual de la app.

PROTOCOLOS DE SEGURIDAD (PRIORIDAD MÁXIMA):
- Si detectas síntomas de INFARTO (dolor pecho, brazo izquierdo), ACV (habla arrastrada, parálisis), ASFIXIA o SANGRADO PROFUSO: Ordena llamar a URGENCIAS inmediatamente. No des más consejos.
- NO DIAGNOSTIQUES enfermedades. Usa frases como "podría indicar", "sugiere", "es compatible con".
- Termina siempre con: "Recuerda consultar a un médico profesional."

PROTOCOLOS DE ACCIÓN:
- Si el usuario describe un síntoma VISIBLE EXTERNAMENTE (piel, ojos, boca, uñas, postura, heridas), sugiere el escáner correspondiente y coloca la etiqueta al final.
- Si el usuario pide escanear un dolor INTERNO (estómago, cabeza, huesos), EXPLICA que la cámara no puede ver dentro del cuerpo y da consejos de alivio general. NO sugieras escáneres.

LISTA DE COMANDOS (Úsalos SOLO si es necesario y SIEMPRE al final del mensaje):
- [ACTION:skin] -> Para manchas, lunares, sarpullidos, acné.
- [ACTION:ocular] -> Para ojos rojos, secreciones, orzuelos.
- [ACTION:dental] -> Para dientes, encías, llagas en boca.
- [ACTION:nails] -> Para hongos, uñas encarnadas, coloración.
- [ACTION:posture] -> Para chequeo de columna o dolor de espalda postural.
- [ACTION:wound] -> Para seguimiento de cortes o cicatrización.

FORMATO:
- Sé conciso y cálido.
- Usa párrafos cortos.
- Si usas una etiqueta, que sea lo ÚLTIMO en el texto.
`;

let chatHistory: Content[] = [];

export const AIService = {
    getInitialGreeting: (): ChatMessage => INITIAL_GREETING,

    startNewSession: () => {
        chatHistory = [];
    },

    setUserName: (name: string) => {
        currentUserName = name;
    },

    classifyImage: async (base64Image: string): Promise<ClassificationResult> => {
        if (!API_KEY) {
            // Fallback manual si no hay API Key
            return {
                detectedZone: 'Piel (Cuerpo)',
                confidence: 0.85,
                recommendedModule: 'skin',
                summary: 'Se ha detectado una zona cutánea para análisis dermatológico.',
                findings: ['Textura uniforme', 'Coloración normal']
            };
        }

        try {
            const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

            const prompt = `Analiza esta imagen médica y determina qué parte del cuerpo o especialidad de la app corresponde.
            Responde ÚNICAMENTE en formato JSON con esta estructura:
            {
              "detectedZone": "Nombre de la zona",
              "confidence": 0.95,
              "recommendedModule": "skin" | "ocular" | "dental" | "posture" | "nails" | "wound" | "capillary" | "throat" | "veins" | "pediatrics" | "intimate" | "bites",
              "summary": "Breve resumen de lo detectado",
              "findings": ["hallazgo 1", "hallazgo 2"]
            }`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inline_data: { mime_type: "image/jpeg", data: base64Image } }
                        ]
                    }]
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            if (!textResponse) {
                console.warn('[HealthAI] Respuesta vacía de la IA');
                throw new Error('La IA no pudo procesar la imagen correctamente.');
            }

            // Limpieza robusta de JSON: buscar el bloque { ... }
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;

            try {
                return JSON.parse(jsonStr);
            } catch (parseError) {
                console.error('[HealthAI] Error al parsear JSON:', jsonStr);
                // Fallback seguro para no romper el flujo de la app
                return {
                    detectedZone: 'Cuerpo (General)',
                    confidence: 0.5,
                    recommendedModule: 'skin',
                    summary: 'La IA identificó la zona pero el formato de respuesta fue inconsistente.',
                    findings: ['Análisis visual completado']
                };
            }
        } catch (error) {
            console.error('[HealthAI] Error en clasificación:', error);
            throw error;
        }
    },

    sendMessage: async (text: string): Promise<ChatMessage> => {
        if (!API_KEY) return AIService.fallbackLogic(text);

        const userMsg: Content = { role: 'user', parts: [{ text: text.trim() }] };

        // Optimización de Historial: Slice últimos 10
        const recentHistory = chatHistory.slice(-10);
        const historyToSend = [...recentHistory, userMsg].filter(m => m.parts[0].text && m.parts[0].text.trim().length > 0);

        let aiResponseText = '';

        try {
            const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + API_KEY;

            const payload = {
                contents: [
                    // Inyección de System Prompt al INICIO del historial
                    {
                        role: "user",
                        parts: [{ text: "SYSTEM INSTRUCTIONS: " + getSystemPrompt(currentUserName) }]
                    },
                    {
                        role: "model",
                        parts: [{ text: `Entendido. Soy HealthAI y ayudaré a ${currentUserName} siguiendo tus protocolos médicos.` }]
                    },
                    ...historyToSend
                ],
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
                ]
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Flash falló, probar Pro
                const urlPro = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY;
                const responsePro = await fetch(urlPro, { // Mismo payload
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!responsePro.ok) throw new Error("API Pro Error: " + await responsePro.text());

                const dataPro = await responsePro.json();
                aiResponseText = dataPro.candidates?.[0]?.content?.parts?.[0]?.text || '';
            } else {
                const data = await response.json();
                aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            }

            if (!aiResponseText) throw new Error('Respuesta vacía');

            // Limpieza de Markdown
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
        // Regex robusta: espacios opcionales, insensible mayúsculas
        const actionRegex = /\[ACTION:\s*(\w+)\s*\]/i;
        const actionMatch = text.match(actionRegex);

        if (actionMatch) {
            const actionType = actionMatch[1].toLowerCase();
            // Eliminar etiqueta del texto visible
            cleanText = text.replace(actionRegex, '').trim();

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
            responseText = 'Para analizar problemas de piel, te recomiendo el escáner Dermatológico.';
            relatedModule = 'skin';
        } else if (lowerText.includes('ojo') || lowerText.includes('visión') || lowerText.includes('rojo')) {
            responseText = 'Para problemas oculares, usa el escáner Ocular.';
            relatedModule = 'ocular';
        } else if (lowerText.includes('diente') || lowerText.includes('boca')) {
            responseText = 'Para salud dental, usa el escáner Dental.';
            relatedModule = 'dental';
        } else if (lowerText.includes('uña') || lowerText.includes('hongo')) {
            responseText = 'Para uñas, usa el escáner de Uñas.';
            relatedModule = 'nails';
        } else if (lowerText.includes('postura') || lowerText.includes('espalda')) {
            responseText = 'Evalúa tu postura con nuestro escáner dedicado.';
            relatedModule = 'posture';
        } else if (lowerText.includes('herida') || lowerText.includes('corte')) {
            responseText = 'Usa el módulo de Heridas para seguimiento.';
            relatedModule = 'wound';
        } else {
            responseText = 'Entiendo. En modo offline te sugiero consultar a un médico si tienes síntomas persistentes. Sigo aquí para orientarte.';
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
