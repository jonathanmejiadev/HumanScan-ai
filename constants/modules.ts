import { ScanType, OverlayType, SpecialistType } from '@/types/analysis';

export interface ModuleConfig {
    id: ScanType;
    name: string;
    description: string;
    icon: string;
    color: string;
    accentColor: string;
    overlayType: OverlayType;
    badges: string[];
    specialist: SpecialistType;
    instructions: string;
}

export const MODULES: Record<ScanType, ModuleConfig> = {
    skin: {
        id: 'skin',
        name: 'Dermatológico',
        description: 'Lunares, manchas o lesiones de la piel',
        icon: 'camera',
        color: '#E8EAF6',
        accentColor: '#5E6AD2',
        overlayType: 'rectangle',
        badges: ['ABCDE', 'GUÍA'],
        specialist: 'Dermatólogo',
        instructions: 'Centra la lesión en el marco y asegúrate de que esté bien iluminada'
    },
    ocular: {
        id: 'ocular',
        name: 'Ocular',
        description: 'Conjuntiva, esclerótica o iris',
        icon: 'eye',
        color: '#E0F2F1',
        accentColor: '#00BFA5',
        overlayType: 'circle',
        badges: ['PUPILA', 'IRIS'],
        specialist: 'Oftalmólogo',
        instructions: 'Abre bien el ojo y centra la pupila en el círculo'
    },
    dental: {
        id: 'dental',
        name: 'Bucodental',
        description: 'Dientes, encías y cavidad oral',
        icon: 'smile',
        color: '#FFF3E0',
        accentColor: '#FF9800',
        overlayType: 'oval',
        badges: ['CARIES', 'ENCÍAS'],
        specialist: 'Odontólogo',
        instructions: 'Abre la boca y centra los dientes en el óvalo'
    },
    posture: {
        id: 'posture',
        name: 'Postura',
        description: 'Alineación de columna y articulaciones',
        icon: 'user',
        color: '#F3E5F5',
        accentColor: '#9C27B0',
        overlayType: 'grid',
        badges: ['COLUMNA', 'IA'],
        specialist: 'Fisioterapeuta',
        instructions: 'Párate de perfil y alinea tu cuerpo con las guías verticales'
    },
    nails: {
        id: 'nails',
        name: 'Uñas',
        description: 'Textura, color y lecho ungueal',
        icon: 'hand',
        color: '#FCE4EC',
        accentColor: '#E91E63',
        overlayType: 'rectangle',
        badges: ['HONGOS', 'COLOR'],
        specialist: 'Dermatólogo',
        instructions: 'Coloca la uña en el centro del marco con buena iluminación'
    },
    wound: {
        id: 'wound',
        name: 'Heridas',
        description: 'Seguimiento y evolución de lesiones',
        icon: 'activity',
        color: '#FFEBEE',
        accentColor: '#F44336',
        overlayType: 'comparison',
        badges: ['TRACKING', 'FECHA'],
        specialist: 'Médico General',
        instructions: 'Centra la herida y alinea con la foto anterior si existe'
    }
};

export const LEGAL_DISCLAIMER =
    'ESTA HERRAMIENTA NO PROPORCIONA UN DIAGNÓSTICO MÉDICO. Su propósito es puramente informativo y educativo. Es obligatorio consultar a un médico para obtener un diagnóstico y tratamiento profesional. En caso de emergencia, contacta inmediatamente a servicios de urgencias.';
