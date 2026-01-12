export const WOUND_ANALYSIS_PROMPT = `Actúas como un asistente avanzado de análisis visual para la salud humana, especializado en el seguimiento y evaluación de heridas.

Tu misión es analizar la imagen de la herida proporcionada y generar un reporte técnico y orientativo sobre hallazgos visuales y evolución. Debes categorizar la gravedad de lo observado.

Instrucciones de Análisis:
1. Examina la herida, sus bordes, el tejido circundante y cualquier exudado visible.
2. Busca signos de:
   - Infección: eritema (enrojecimiento) perilesional, edema, calor, exudado purulento
   - Cicatrización: tejido de granulación rosado, epitelización desde los bordes
   - Necrosis: tejido negro o gris oscuro
   - Tamaño y profundidad: estima dimensiones aproximadas
   - Tipo de herida: abrasión, laceración, úlcera, quemadura
3. Si hay imagen previa, compara:
   - Reducción o aumento del área
   - Mejoría o empeoramiento de signos inflamatorios
   - Progreso de cicatrización
4. Si la imagen no es clara, indica que no es apta para análisis.

IMPORTANTE: Mantén un tono clínico, empático y cauteloso. NO uses lenguaje determinista; usa lenguaje de probabilidad.

Para analisis_abcde_detalle, responde "N/A - Criterio específico para lesiones cutáneas".

El aviso_legal SIEMPRE debe ser: "SEGUIMIENTO DE HERIDAS BASADO EN IA. Este reporte es puramente orientativo y no constituye un diagnóstico clínico. Es obligatorio consultar a un médico o cirujano para el tratamiento de heridas. Busque atención inmediata ante fiebre o secreción purulenta."

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido. Está terminantemente prohibido incluir introducciones, explicaciones previas, comentarios o bloques de código markdown. 
Responde ÚNICAMENTE con un JSON que cumpla estrictamente este esquema:
{
  "descripcion_tecnica": "string",
  "hallazgos_principales": ["string"],
  "triaje_riesgo": "Bajo" | "Medio" | "Alto" | "Emergencia",
  "analisis_abcde_detalle": "string",
  "especialista_recomendado": "Dermatólogo" | "Oftalmólogo" | "Médico General" | "Odontólogo" | "Fisioterapeuta" | "Traumatólogo" | "Cirujano" | "Pediatra" | "Urólogo" | "Ginecólogo",
  "guia_de_consulta": ["string", "string", "string"],
  "pasos_a_seguir": "string",
  "aviso_legal": "string"
}`;

import AsyncStorage from '@react-native-async-storage/async-storage';

const WOUND_HISTORY_KEY = '@wound_tracking_history';

export interface WoundRecord {
    id: string;
    timestamp: number;
    imageUri: string;
    analysisResult?: any;
}

export async function getWoundHistory(woundId?: string): Promise<WoundRecord[]> {
    try {
        const historyJson = await AsyncStorage.getItem(WOUND_HISTORY_KEY);
        if (!historyJson) return [];

        const allHistory: Record<string, WoundRecord[]> = JSON.parse(historyJson);

        if (woundId) {
            return allHistory[woundId] || [];
        }

        // Return all records flattened
        return Object.values(allHistory).flat();
    } catch (error) {
        console.error('[WoundTracking] Error getting history:', error);
        return [];
    }
}

export async function saveWoundRecord(woundId: string, record: WoundRecord): Promise<void> {
    try {
        const historyJson = await AsyncStorage.getItem(WOUND_HISTORY_KEY);
        const allHistory: Record<string, WoundRecord[]> = historyJson ? JSON.parse(historyJson) : {};

        if (!allHistory[woundId]) {
            allHistory[woundId] = [];
        }

        allHistory[woundId].push(record);

        await AsyncStorage.setItem(WOUND_HISTORY_KEY, JSON.stringify(allHistory));
    } catch (error) {
        console.error('[WoundTracking] Error saving record:', error);
        throw error;
    }
}

export async function getPreviousWoundImage(woundId: string): Promise<string | undefined> {
    const history = await getWoundHistory(woundId);
    if (history.length === 0) return undefined;

    // Return the most recent image
    const sorted = history.sort((a, b) => b.timestamp - a.timestamp);
    return sorted[0].imageUri;
}
