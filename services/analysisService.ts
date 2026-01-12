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

const SKIN_ANALYSIS_PROMPT = `Actúas como un asistente avanzado de análisis visual para la salud humana, especializado en la detección preliminar de afecciones dermatológicas.

Tu misión es analizar la imagen proporcionada y generar un reporte técnico y orientativo sobre hallazgos visuales. Debes categorizar la gravedad de lo observado.

Instrucciones de Análisis:
1. Evaluación de Lesiones (ABCDE): Ante manchas o lunares, analiza: Asimetría, Bordes (regulares/irregulares), Color (homogéneo/múltiple), Diámetro y Evolución visual.
2. Identificación de Patrones: Busca signos de inflamación, infecciones fúngicas, reacciones alérgicas cutáneas, acné, dermatitis, psoriasis, u otras anomalías.
3. Si la imagen no es clara o no muestra piel, indica que no es apta para análisis.

IMPORTANTE: Mantén un tono clínico, empático y cauteloso. NO uses lenguaje determinista (ej. "Usted tiene..."); usa lenguaje de probabilidad (ej. "Los hallazgos son compatibles con...", "Se observan características que podrían sugerir...").

El aviso_legal SIEMPRE debe ser: "ESTA HERRAMIENTA NO PROPORCIONA UN DIAGNÓSTICO MÉDICO. Su propósito es puramente informativo y educativo. Es obligatorio consultar a un médico para obtener un diagnóstico y tratamiento profesional."

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido que siga exactamente esta estructura:
{
  "descripcion_tecnica": "string",
  "hallazgos_principales": ["string"],
  "triaje_riesgo": "Bajo" | "Medio" | "Alto" | "Emergencia",
  "analisis_abcde_detalle": "string",
  "especialista_recomendado": "Dermatólogo" | "Oftalmólogo" | "Médico General",
  "guia_de_consulta": ["string", "string", "string"],
  "pasos_a_seguir": "string",
  "aviso_legal": "string"
}`;

const OCULAR_ANALYSIS_PROMPT = `Actúas como un asistente avanzado de análisis visual para la salud humana, especializado en la detección preliminar de afecciones oculares.

Tu misión es analizar la imagen del ojo proporcionada y generar un reporte técnico y orientativo sobre hallazgos visuales. Debes categorizar la gravedad de lo observado.

Instrucciones de Análisis:
1. Examina la conjuntiva, esclerótica, iris, pupila y párpados visibles.
2. Busca signos de: enrojecimiento, inflamación, secreciones, pterigión, cataratas visibles, asimetría pupilar, coloración anormal.
3. Si la imagen no es clara o no muestra el ojo correctamente, indica que no es apta para análisis.

IMPORTANTE: Mantén un tono clínico, empático y cauteloso. NO uses lenguaje determinista; usa lenguaje de probabilidad.

Para analisis_abcde_detalle, responde "N/A - Criterio específico para lesiones cutáneas".

El aviso_legal SIEMPRE debe ser: "ESTA HERRAMIENTA NO PROPORCIONA UN DIAGNÓSTICO MÉDICO. Su propósito es puramente informativo y educativo. Es obligatorio consultar a un médico para obtener un diagnóstico y tratamiento profesional."

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido que siga exactamente esta estructura:
{
  "descripcion_tecnica": "string",
  "hallazgos_principales": ["string"],
  "triaje_riesgo": "Bajo" | "Medio" | "Alto" | "Emergencia",
  "analisis_abcde_detalle": "string",
  "especialista_recomendado": "Dermatólogo" | "Oftalmólogo" | "Médico General",
  "guia_de_consulta": ["string", "string", "string"],
  "pasos_a_seguir": "string",
  "aviso_legal": "string"
}`;

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

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido que siga exactamente esta estructura:
{
  "descripcion_tecnica": "string",
  "hallazgos_principales": ["string"],
  "triaje_riesgo": "Bajo" | "Medio" | "Alto" | "Emergencia",
  "analisis_abcde_detalle": "string",
  "especialista_recomendado": "Fisioterapeuta" | "Traumatólogo",
  "guia_de_consulta": ["string", "string", "string"],
  "pasos_a_seguir": "string",
  "aviso_legal": "string"
}`;

const CAPILLARY_ANALYSIS_PROMPT = `Actúas como un experto en salud capilar. Analiza la imagen del cuero cabelludo o cabello buscando:
1. Densidad folicular y zonas de adelgazamiento.
2. Salud del cuero cabelludo (rojeces, descamación, caspa, sebo).
3. Línea capilar y patrones de retroceso.

Genera un reporte técnico siguiendo el formato JSON especificado.
Especialista recomendado: Dermatólogo.`;

const THROAT_ANALYSIS_PROMPT = `Actúas como un asistente de salud especializado en otorrinolaringología. Analiza la imagen de la garganta buscando:
1. Estado de amígdalas (inflamación, tamaño, presencia de placas blanquecinas).
2. Úvula y faringe posterior (coloración, irritación).
3. Signos de infección viral o bacteriana sugeridos visualmente.

Genera un reporte técnico siguiendo el formato JSON especificado.
Especialista recomendado: Médico General.`;

const VEINS_ANALYSIS_PROMPT = `Actúas como especialista en salud vascular. Analiza la imagen de las piernas buscando:
1. Venas dilatadas o tortuosas (varices).
2. Arañitas vasculares (telangiectasias).
3. Cambios en la coloración de la piel o signos de inflamación/edema.

Genera un reporte técnico siguiendo el formato JSON especificado.
Especialista recomendado: Traumatólogo o Cirujano.`;

const PEDIATRICS_ANALYSIS_PROMPT = `Actúas como pediatra experto en dermatología infantil. Analiza la imagen buscando:
1. Tipo de exantema o brote (distribución, forma, color).
2. Signos compatibles con varicela, sarampión u otras enfermedades eruptivas.
3. Reacciones alérgicas comunes en niños.

Genera un reporte técnico siguiendo el formato JSON especificado.
Especialista recomendado: Pediatra.`;

const INTIMATE_ANALYSIS_PROMPT = `Actúas como un asistente médico profesional y discreto para salud íntima. Analiza la imagen buscando:
1. Presencia de verrugas, llagas o úlceras.
2. Protuberancias inusuales o irritaciones severas.
3. Cambios en la mucosa que requieran atención inmediata.

Genera un reporte técnico siguiendo el formato JSON especificado.
Especialista recomendado: Médico General, Ginecólogo o Urólogo.`;

const BITES_ANALYSIS_PROMPT = `Actúas como experto en toxicología y dermatología. Analiza la imagen de la picadura buscando:
1. Punto central de picada y patrón (única, múltiple, lineal).
2. Reacción inflamatoria (eritema, edema, ampollas).
3. Signos de alarma (necrosis, expansión rápida del halo).

Genera un reporte técnico siguiendo el formato JSON especificado.
Especialista recomendado: Médico General.`;

export async function analyzeImage(
  imageBase64: string,
  scanType: ScanType
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
              { text: prompt },
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
        ]
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

    // Parsear el JSON de la respuesta (puede venir con markdown code blocks)
    let jsonText = text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

    // Verificar si el texto parece ser una negativa en lugar de un JSON
    const refusalPhrases = ['no puedo', 'políticas', 'seguridad', 'disculpas', 'I cannot', 'I am sorry', 'safety policies'];
    if (!jsonText.startsWith('{') && refusalPhrases.some(phrase => jsonText.toLowerCase().includes(phrase))) {
      console.warn('[AnalysisService] AI refusal detected in text content');
      throw new Error('SAFETY_BLOCK');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonText);
    } catch (jsonError: any) {
      console.error('[AnalysisService] JSON parse error. Text received:', text.substring(0, 200));
      // Si el parseo falla y el tipo de escaneo es íntimo, es muy probable que sea un bloqueo de seguridad implícito
      if (scanType === 'intimate' || scanType === 'pediatrics') {
        throw new Error('SAFETY_BLOCK');
      }
      throw new Error('INVALID_RESPONSE');
    }

    // Validar con el schema
    let validatedResult;
    try {
      validatedResult = analysisSchema.parse(parsedResult);
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
