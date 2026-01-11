import { ScanType, OverlayType, SpecialistType } from '@/types/analysis';

export interface ModuleConfig {
    id: ScanType;
    name: string;
    description: string;
    icon: string;
    color: string;
    accentColor: string;
    gradientColors: [string, string]; // New prop for gradient background
    overlayType: OverlayType;
    badges: string[];
    specialist: SpecialistType;
    instructions: string;
}

export const MODULES: Record<ScanType, ModuleConfig> = {
    skin: {
        id: 'skin',
        name: 'Dermatológico',
        description: 'Evaluación de piel, lunares, manchas y lesiones cutáneas.',
        icon: 'scan',
        color: '#E8EAF6',
        accentColor: '#5E6AD2',
        gradientColors: ['#F3E8FF', '#FFFFFF'], // Violeta pálido -> Blanco
        overlayType: 'rectangle',
        badges: ['ABCDE', 'Triaje', 'Guía'],
        specialist: 'Dermatólogo',
        instructions: 'Centra la lesión en el marco y asegúrate de que esté bien iluminada'
    },
    ocular: {
        id: 'ocular',
        name: 'Ocular',
        description: 'Evaluación visual de conjuntiva, esclerótica e iris.',
        icon: 'eye',
        color: '#E0F2F1',
        accentColor: '#00BFA5',
        gradientColors: ['#E0F2FE', '#FFFFFF'], // Azul pálido -> Blanco
        overlayType: 'circle',
        badges: ['Conjuntiva', 'Pupila', 'Iris'],
        specialist: 'Oftalmólogo',
        instructions: 'Abre bien el ojo y centra la pupila en el círculo'
    },
    dental: {
        id: 'dental',
        name: 'Bucodental',
        description: 'Detección de caries, estado de encías e higiene oral.',
        icon: 'smile',
        color: '#FFF3E0',
        accentColor: '#FF9800',
        gradientColors: ['#FEF3C7', '#FFFFFF'], // Amarillo/Naranja pálido -> Blanco
        overlayType: 'oval',
        badges: ['Encías', 'Esmalte', 'Placa'],
        specialist: 'Odontólogo',
        instructions: 'Abre la boca y centra los dientes en el óvalo'
    },
    posture: {
        id: 'posture',
        name: 'Postura',
        description: 'Evaluación de alineación de hombros, columna y cadera.',
        icon: 'user',
        color: '#F3E5F5',
        accentColor: '#9C27B0',
        gradientColors: ['#FAE8FF', '#FFFFFF'], // Magenta pálido -> Blanco
        overlayType: 'grid',
        badges: ['Simetría', 'Ergonomía', 'Eje'],
        specialist: 'Fisioterapeuta',
        instructions: 'Párate de perfil y alinea tu cuerpo con las guías verticales'
    },
    nails: {
        id: 'nails',
        name: 'Uñas',
        description: 'Monitoreo de color y textura para detectar deficiencias.',
        icon: 'hand',
        color: '#FCE4EC',
        accentColor: '#E91E63',
        gradientColors: ['#FFE4E6', '#FFFFFF'], // Rosa pálido -> Blanco
        overlayType: 'rectangle',
        badges: ['Lúnula', 'Textura', 'Hongos'],
        specialist: 'Dermatólogo',
        instructions: 'Coloca la uña en el centro del marco con buena iluminación'
    },
    wound: {
        id: 'wound',
        name: 'Heridas',
        description: 'Control de cicatrización y detección de signos de infección.',
        icon: 'activity',
        color: '#FFEBEE',
        accentColor: '#F44336',
        gradientColors: ['#FEE2E2', '#FFFFFF'], // Rojo pálido -> Blanco
        overlayType: 'comparison',
        badges: ['Evolución', 'Cierre', 'Infección'],
        specialist: 'Médico General',
        instructions: 'Centra la herida y alinea con la foto anterior si existe'
    }
};

export const LEGAL_DISCLAIMER =
    'ESTA HERRAMIENTA NO PROPORCIONA UN DIAGNÓSTICO MÉDICO. Su propósito es puramente informativo y educativo. Es obligatorio consultar a un médico para obtener un diagnóstico y tratamiento profesional. En caso de emergencia, contacta inmediatamente a servicios de urgencias.';
