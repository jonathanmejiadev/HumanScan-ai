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
    },
    capillary: {
        id: 'capillary',
        name: 'Capilar',
        description: 'Análisis de densidad folicular, salud del cuero cabelludo y retroceso de la línea capilar.',
        icon: 'user',
        color: '#F1F5F9',
        accentColor: '#475569',
        gradientColors: ['#E2E8F0', '#FFFFFF'], // Gris Slate 200 -> Blanco
        overlayType: 'rectangle',
        badges: ['Densidad', 'Folículo', 'Recesión'],
        specialist: 'Dermatólogo',
        instructions: 'Separa el cabello para exponer el cuero cabelludo y mantén una buena iluminación'
    },
    throat: {
        id: 'throat',
        name: 'Garganta',
        description: 'Evaluación de amígdalas, úvula y faringe para detectar placas, irritación o inflamación.',
        icon: 'smile',
        color: '#FFF5F5',
        accentColor: '#EF4444',
        gradientColors: ['#FCE7F3', '#FFFFFF'], // Rosa 100 -> Blanco (Diferente a Heridas)
        overlayType: 'oval',
        badges: ['Amígdalas', 'Placas', 'Faringe'],
        specialist: 'Médico General',
        instructions: 'Abre bien la boca y saca la lengua, asegúrate de iluminar bien la zona posterior'
    },
    veins: {
        id: 'veins',
        name: 'Varices',
        description: 'Detección de arañitas vasculares y cambios de coloración por insuficiencia venosa.',
        icon: 'activity',
        color: '#EFF6FF',
        accentColor: '#1E3A8A',
        gradientColors: ['#E0E7FF', '#FFFFFF'], // Indigo 100 -> Blanco
        overlayType: 'rectangle',
        badges: ['Vascular', 'Retención', 'Pigmento'],
        specialist: 'Traumatólogo',
        instructions: 'Centra la zona de las piernas afectada y procura estar de pie para mayor visibilidad'
    },
    pediatrics: {
        id: 'pediatrics',
        name: 'Pediatría',
        description: 'Detección de exantemas infantiles, varicela y manchas relacionadas con cuadros febriles.',
        icon: 'baby',
        color: '#FEFCE8',
        accentColor: '#EAB308',
        gradientColors: ['#FEF9C3', '#FFFFFF'], // Amarillo 100 -> Blanco
        overlayType: 'rectangle',
        badges: ['Exantema', 'Brote', 'Infantil'],
        specialist: 'Pediatra',
        instructions: 'Enfoca la zona del brote o sarpullido con luz natural si es posible'
    },
    intimate: {
        id: 'intimate',
        name: 'Salud Íntima',
        description: 'Identificación de verrugas, llagas o protuberancias inusuales para triaje de salud sexual.',
        icon: 'shield-alert',
        color: '#FAF5FF',
        accentColor: '#581C87',
        gradientColors: ['#EDE9FE', '#FFFFFF'], // Violeta 100 -> Blanco
        overlayType: 'circle',
        badges: ['Lesión', 'Mucosa', 'Alerta'],
        specialist: 'Médico General',
        instructions: 'Busca un lugar privado con buena luz y centra la cámara en la zona de interés'
    },
    bites: {
        id: 'bites',
        name: 'Picaduras',
        description: 'Diferenciación entre picaduras de insectos, arácnidos o reacciones alérgicas localizadas.',
        icon: 'bug',
        color: '#FFF7ED',
        accentColor: '#EA580C',
        gradientColors: ['#FFEDD5', '#FFFFFF'], // Naranja 100 -> Blanco
        overlayType: 'rectangle',
        badges: ['Insecto', 'Eritema', 'Reacción'],
        specialist: 'Médico General',
        instructions: 'Centra la picadura y trata de captar los bordes de la reacción inflamatoria'
    }
};

export const LEGAL_DISCLAIMER =
    'ESTA HERRAMIENTA NO PROPORCIONA UN DIAGNÓSTICO MÉDICO. Su propósito es puramente informativo y educativo. Es obligatorio consultar a un médico para obtener un diagnóstico y tratamiento profesional. En caso de emergencia, contacta inmediatamente a servicios de urgencias.';
