import { z } from 'zod';
import { AnalysisResult, ScanType } from '@/types/analysis';
import { DENTAL_ANALYSIS_PROMPT } from './dentalAnalysisService';
import { NAILS_ANALYSIS_PROMPT } from './nailsAnalysisService';
import { WOUND_ANALYSIS_PROMPT } from './woundTrackingService';

const analysisSchema = z.object({
  descripcion_tecnica: z.string().describe('Descripción objetiva de la zona analizada (morfología, coloración, distribución).'),
  hallazgos_principales: z.array(z.string()).describe('Lista de condiciones potenciales identificadas'),
  triaje_riesgo: z.enum(['Bajo', 'Medio', 'Alto', 'Emergencia']).describe('Nivel de riesgo del triaje'),
  analisis_abcde_detalle: z.string().describe('Análisis ABCDE específico para lunares, o N/A si no aplica'),
  especialista_recomendado: z.enum(['Dermatólogo', 'Oftalmólogo', 'Médico General', 'Odontólogo', 'Fisioterapeuta', 'Traumatólogo', 'Cirujano', 'Pediatra', 'Urólogo', 'Ginecólogo']).describe('Tipo de especialista recomendado'),
  guia_de_consulta: z.array(z.string()).min(3).max(3).describe('3 preguntas específicas que el usuario debe hacerle al médico'),
  pasos_a_seguir: z.string().describe('Instrucciones preventivas detalladas'),
  aviso_legal: z.string().describe('Aviso legal obligatorio'),
});

const medicationSchema = z.object({
  nombre_detectado: z.string().describe('Nombre comercial detectado y principio activo (Ej: Actron - Ibuprofeno).'),
  concentracion: z.string().describe('Potencia visible (Ej: 600mg, 10ml). Si no es visible, poner "No identificada".'),
  para_que_sirve: z.string().describe('Explicación breve y sencilla del uso terapéutico.'),
  como_se_toma: z.string().describe('Pautas generales de administración, aclarando que requiere receta médica.'),
  advertencias_clave: z.array(z.string()).describe('Lista de 3-4 precauciones importantes (Ej: Alcohol, Embarazo).'),
  efectos_secundarios_comunes: z.array(z.string()).describe('Lista breve de efectos adversos frecuentes.'),
  aviso_legal: z.string().describe('Texto fijo: "La automedicación es peligrosa. Consulte siempre a su médico."'),
});

const JSON_FORMAT_INSTRUCTION = `
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

const SKIN_ANALYSIS_PROMPT = `Actúas como un asistente avanzado de análisis visual para la salud humana, especializado en la detección preliminar de afecciones dermatológicas.

Tu misión es analizar la imagen proporcionada y generar un reporte técnico y orientativo sobre hallazgos visuales. Debes categorizar la gravedad de lo observado.

Instrucciones de Análisis Clínico:
1. Evaluación de Lesiones (ABCDE): Ante manchas o lunares, analiza: Asimetría, Bordes (regulares/irregulares), Color (homogéneo/múltiple), Diámetro y Evolución visual.
2. Actividad vs. Estabilidad: Si una lesión es asimétrica pero se describe como antigua/estable y no tiene signos de actividad (sangrado, costras nuevas, inflamación perilesional, secreción), clasifica el riesgo como 'Bajo'.
3. Identificación de Patrones: Busca signos de inflamación, infecciones fúngicas, reacciones alérgicas cutáneas, acné, dermatitis, psoriasis, u otras anomalías.
4. Si la imagen no es clara o no muestra piel, indica que no es apta para análisis.

IMPORTANTE: Mantén un tono clínico, empático y cauteloso. NO uses lenguaje determinista; usa lenguaje de probabilidad.

El aviso_legal SIEMPRE debe ser: "ESTA HERRAMIENTA NO PROPORCIONA UN DIAGNÓSTICO MÉDICO. Su propósito es puramente informativo y educativo. Es obligatorio consultar a un médico para obtener un diagnóstico y tratamiento profesional."

${JSON_FORMAT_INSTRUCTION}`;

const OCULAR_ANALYSIS_PROMPT = `Actúas como un asistente avanzado de análisis visual para la salud humana, especializado en la detección preliminar de afecciones oculares.

Tu misión es analizar la imagen del ojo proporcionada y generar un reporte técnico y orientativo sobre hallazgos visuales. Debes categorizar la gravedad de lo observado.

Instrucciones de Análisis:
1. Examina la conjuntiva, esclerótica, iris, pupila y párpados visibles.
2. Busca signos de: enrojecimiento, inflamación, secreciones, pterigión, cataratas visibles, asimetría pupilar, coloración anormal.
3. Si la imagen no es clara o no muestra el ojo correctamente, indica que no es apta para análisis.

IMPORTANTE: Mantén un tono clínico, empático y cauteloso. NO uses lenguaje determinista; usa lenguaje de probabilidad.

Para analisis_abcde_detalle, responde "N/A - Criterio específico para lesiones cutáneas".

El aviso_legal SIEMPRE debe ser: "ESTA HERRAMIENTA NO PROPORCIONA UN DIAGNÓSTICO MÉDICO. Su propósito es puramente informativo y educativo. Es obligatorio consultar a un médico para obtener un diagnóstico y tratamiento profesional."

${JSON_FORMAT_INSTRUCTION}`;

const POSTURE_ANALYSIS_PROMPT = `Actúas como un asistente avanzado de análisis visual para la salud humana, especializado en la evaluación preliminar de la postura corporal.

Tu misión es analizar la imagen de la postura proporcionada y generar un reporte técnico y orientativo sobre hallazgos visuales. Debes categorizar la gravedad de lo observado.

Instrucciones de Análisis:
1. Examina la alineación de hombros, columna vertebral, cadera, rodillas y tobillos.
2. Busca signos de:
   - Escoliosis: curvatura lateral de la columna
   - Lordosis: curvatura excesiva hacia adelante (zona lumbar)
   - Cifosis: curvatura excesiva hacia atrás (zona torácica)
   - Desalineación de hombros: un hombro más alto que el otro
   - Inclinación pélvica
   - Hiperextensión o flexión de rodillas
3. Si la imagen no muestra el cuerpo completo de perfil o frontal, indica que no es apta para análisis.

IMPORTANTE: Mantén un tono clínico, empático y cauteloso. NO uses lenguaje determinista; usa lenguaje de probabilidad.

Para analisis_abcde_detalle, responde "N/A - Criterio específico para lesiones cutáneas".

El aviso_legal SIEMPRE debe ser: "ESTA HERRAMIENTA NO PROPORCIONA UN DIAGNÓSTICO MÉDICO. Su propósito es puramente informativo y educativo. Es obligatorio consultar a un fisioterapeuta o traumatólogo para obtener un diagnóstico y tratamiento profesional."

${JSON_FORMAT_INSTRUCTION}`;

const CAPILLARY_ANALYSIS_PROMPT = `Actúas como un experto en salud capilar. Analiza la imagen del cuero cabelludo o cabello buscando:
1. Densidad folicular y zonas de adelgazamiento.
2. Salud del cuero cabelludo (rojeces, descamación, caspa, sebo).
3. Línea capilar y patrones de retroceso.

${JSON_FORMAT_INSTRUCTION}`;

const THROAT_ANALYSIS_PROMPT = `Actúas como un asistente de salud especializado en otorrinolaringología. Analiza la imagen de la garganta buscando:
1. Diferenciación de Riesgo:
   - Riesgo Bajo: Irritación simple, enrojecimiento leve sin placas.
   - Riesgo Alto/Emergencia: Exudado purulento (placas blancas), inflamación severa de amígdalas que dificulte la deglución, o signos compatibles con fiebre alta según descripción.
2. Estado de amígdalas (inflamación, tamaño, presencia de placas blanquecinas).
3. Úvula y faringe posterior (coloración, irritación).

${JSON_FORMAT_INSTRUCTION}`;

const VEINS_ANALYSIS_PROMPT = `Actúas como especialista en salud vascular. Analiza la imagen de las piernas buscando:
1. Graduación de Insuficiencia Venosa:
   - Riesgo Bajo: "Arañitas" o telangiectasias puramente estéticas.
   - Riesgo Medio: Venas abultadas, tortuosas o cordones venosos (varices).
   - Riesgo Alto: Úlceras abiertas, cambios de coloración oscura/ocre en los tobillos o inflamación severa (edema).
2. Cambios en la coloración de la piel o signos de inflamación.

${JSON_FORMAT_INSTRUCTION}`;

const PEDIATRICS_ANALYSIS_PROMPT = `Actúas como pediatra experto en dermatología infantil. Analiza la imagen buscando:
1. Tipo de exantema o brote (distribución, forma, color).
2. Signos compatibles con varicela, sarampión u otras enfermedades eruptivas.
3. Reacciones alérgicas comunes en niños.

${JSON_FORMAT_INSTRUCTION}`;

const INTIMATE_ANALYSIS_PROMPT = `Actúas como un asistente médico profesional y discreto para salud íntima. Analiza la imagen buscando verrugas, llagas o úlceras.

Lógica de Direccionamiento de Especialista:
- Si detectas anatomía masculina con lesiones, recomienda 'Urólogo'.
- Si detectas anatomía femenina con lesiones, recomienda 'Ginecólogo'.
- Si las lesiones parecen ser puramente dermatológicas (irritación, eccema cutáneo) sin compromiso evidente de órganos reproductivos, recomienda 'Dermatólogo'.
- En caso de duda sobre la anatomía, recomienda 'Médico General'.

${JSON_FORMAT_INSTRUCTION}`;

const BITES_ANALYSIS_PROMPT = `Actúas como experto en toxicología y dermatología. Analiza la imagen de la picadura buscando:
1. Signos de Alarma: Necrosis central (punto negro), eritema migrante (patrón de "ojo de buey" con halo expansivo), o ampollas grandes. Riesgo: Alto.
2. Picadura Común: Pápula roja simple, prurito leve sin expansión sistémica. Riesgo: Bajo.
3. Patrón de picada y reacción inflamatoria.

${JSON_FORMAT_INSTRUCTION}`;

const MEDICATION_ANALYSIS_PROMPT = `Actúas como un Farmacéutico Experto. Tu misión es analizar imágenes de cajas, blísteres, frascos o etiquetas de medicamentos para identificar el producto y proporcionar información clave.

Instrucciones:
1. Extrae el nombre comercial y el principio activo.
2. Identifica la concentración (ej. 500mg, 10ml).
3. Explica su uso principal, administración y advertencias importantes.
4. Si la imagen NO es un medicamento, intenta identificar qué es o indica que no se reconoce como fármaco.

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido conforme a este esquema:
{
  "nombre_detectado": "string",
  "concentracion": "string",
  "para_que_sirve": "string",
  "como_se_toma": "string",
  "advertencias_clave": ["string"],
  "efectos_secundarios_comunes": ["string"],
  "aviso_legal": "La automedicación es peligrosa. Consulte siempre a su médico."
}`;

export async function analyzeImage(
  imageBase64: string,
  scanType: ScanType,
  userNotes: string = ""
): Promise<Omit<AnalysisResult, 'id' | 'timestamp' | 'scanType' | 'imageUri'>> {
  let prompt: string;

  switch (scanType) {
    case 'skin':
      prompt = SKIN_ANALYSIS_PROMPT;
      break;
    case 'ocular':
      prompt = OCULAR_ANALYSIS_PROMPT;
      break;
    case 'dental':
      prompt = DENTAL_ANALYSIS_PROMPT;
      break;
    case 'posture':
      prompt = POSTURE_ANALYSIS_PROMPT;
      break;
    case 'nails':
      prompt = NAILS_ANALYSIS_PROMPT;
      break;
    case 'wound':
      prompt = WOUND_ANALYSIS_PROMPT;
      break;
    case 'capillary':
      prompt = CAPILLARY_ANALYSIS_PROMPT;
      break;
    case 'throat':
      prompt = THROAT_ANALYSIS_PROMPT;
      break;
    case 'veins':
      prompt = VEINS_ANALYSIS_PROMPT;
      break;
    case 'pediatrics':
      prompt = PEDIATRICS_ANALYSIS_PROMPT;
      break;
    case 'intimate':
      prompt = INTIMATE_ANALYSIS_PROMPT;
      break;
    case 'bites':
      prompt = BITES_ANALYSIS_PROMPT;
      break;
    case 'medication':
      prompt = MEDICATION_ANALYSIS_PROMPT;
      break;
    default:
      prompt = SKIN_ANALYSIS_PROMPT;
  }

  console.log('[AnalysisService] Starting analysis for:', scanType);
  console.log('[AnalysisService] Image base64 length:', imageBase64.length);

  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

    if (!apiKey) {
      throw new Error('API key no configurada. Por favor, verifica que EXPO_PUBLIC_GEMINI_API_KEY esté en el archivo .env');
    }

    // Limpiar el base64 si viene con prefijo data URL
    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt + (userNotes ? `\n\nContexto adicional del paciente: ${userNotes}` : "") },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: cleanBase64
                }
              }
            ]
          }
        ],
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ],
        generationConfig: {
          response_mime_type: "application/json",
        }
      })
    });

    // Validar que la respuesta sea exitosa
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AnalysisService] API Error Response:', errorText);
      throw new Error('SERVICE_UNAVAILABLE');
    }

    // Intentar parsear la respuesta como JSON
    let data;
    try {
      const responseText = await response.text();
      // Verificar que no sea HTML o texto plano
      if (responseText.trim().startsWith('<') || !responseText.trim().startsWith('{')) {
        console.error('[AnalysisService] Invalid response format:', responseText.substring(0, 200));
        throw new Error('INVALID_RESPONSE');
      }
      data = JSON.parse(responseText);
    } catch (parseError: any) {
      console.error('[AnalysisService] Parse error:', parseError);
      throw new Error('INVALID_RESPONSE');
    }

    // Probar si el objeto data tiene la estructura esperada de error de la API
    if (data.error) {
      console.error('[AnalysisService] API Error:', data.error);
      throw new Error('API_ERROR');
    }

    // Verificar bloqueos de seguridad o contenido de Gemini (Hard block en metadatos)
    const blockReason = data.promptFeedback?.blockReason;
    const finishReason = data.candidates?.[0]?.finishReason;

    const safetyBlocked = !!blockReason ||
      finishReason === 'SAFETY' ||
      finishReason === 'OTHER' ||
      data.candidates?.[0]?.safetyRatings?.some((r: any) => r.blocked);

    if (safetyBlocked) {
      console.warn('[AnalysisService] Content block detected:', blockReason || finishReason);
      throw new Error('SAFETY_BLOCK');
    }

    // Validar que existan candidatos y contenido
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('[AnalysisService] Invalid response structure:', JSON.stringify(data, null, 2));
      throw new Error('INVALID_RESPONSE');
    }

    const text = data.candidates[0].content.parts[0].text;

    if (!text || typeof text !== 'string') {
      console.error('[AnalysisService] No text in response');
      throw new Error('INVALID_RESPONSE');
    }

    // Parsear el JSON de la respuesta (usando regex para mayor robustez)
    let jsonText = "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    } else {
      console.error('[AnalysisService] No JSON found in response text:', text);
      throw new Error('INVALID_RESPONSE');
    }

    // Verificar si el texto parece ser una negativa en lugar de un JSON
    const refusalPhrases = ['no puedo', 'políticas', 'seguridad', 'disculpas', 'I cannot', 'I am sorry', 'safety policies'];
    if (refusalPhrases.some(phrase => text.toLowerCase().includes(phrase)) && !jsonText) {
      console.warn('[AnalysisService] AI refusal detected in text content');
      throw new Error('SAFETY_BLOCK');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonText);
    } catch (jsonError: any) {
      console.error('[AnalysisService] JSON parse error. Extracted JSON text:', jsonText);
      console.error('[AnalysisService] Full text received:', text);
      throw new Error('INVALID_RESPONSE');
    }

    // Validar con el esquema correspondiente
    let validatedResult;
    try {
      const activeSchema = scanType === 'medication' ? medicationSchema : analysisSchema;
      validatedResult = activeSchema.parse(parsedResult);
    } catch (validationError: any) {
      console.error('[AnalysisService] Validation error:', validationError);
      console.error('[AnalysisService] Parsed result:', JSON.stringify(parsedResult, null, 2));
      throw new Error('INVALID_RESPONSE');
    }

    console.log('[AnalysisService] Analysis complete:', validatedResult);
    return validatedResult;

  } catch (error) {
    console.error('[AnalysisService] Error analyzing image:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage === 'SERVICE_UNAVAILABLE') {
      throw new Error('El servicio de análisis no está disponible en este momento. Por favor, intenta más tarde.');
    }

    if (errorMessage === 'INVALID_RESPONSE' || errorMessage.includes('JSON')) {
      throw new Error('No se pudo procesar la respuesta del análisis. Por favor, intenta tomar otra foto.');
    }

    if (errorMessage === 'API_ERROR') {
      throw new Error('Hubo un problema con el servicio de análisis. Por favor, intenta nuevamente.');
    }

    if (errorMessage === 'SAFETY_BLOCK') {
      throw new Error('No se pudo procesar la imagen por políticas de seguridad de la IA. Para el análisis de salud íntima, asegúrate de enfocar únicamente la zona afectada, con luz natural y evitando mostrar más contexto del necesario.');
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('Network')) {
      throw new Error('Error de conexión. Verifica tu conexión a internet e intenta de nuevo.');
    }

    if (errorMessage.includes('offline') || errorMessage.includes('OFFLINE')) {
      throw new Error('El servicio de análisis está temporalmente no disponible. Por favor, intenta de nuevo en unos minutos.');
    }

    throw new Error('No se pudo completar el análisis. Por favor, intenta de nuevo.');
  }
}
