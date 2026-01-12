export type RiskLevel = 'Bajo' | 'Medio' | 'Alto' | 'Emergencia';

export type ScanType = 'skin' | 'ocular' | 'dental' | 'posture' | 'nails' | 'wound' | 'capillary' | 'throat' | 'veins' | 'pediatrics' | 'intimate' | 'bites' | 'medication';

export type SpecialistType = 'Dermatólogo' | 'Oftalmólogo' | 'Médico General' | 'Odontólogo' | 'Fisioterapeuta' | 'Traumatólogo' | 'Cirujano' | 'Pediatra' | 'Urólogo' | 'Ginecólogo' | 'Farmacéutico';

export type OverlayType = 'rectangle' | 'circle' | 'oval' | 'grid' | 'comparison';

export interface MedicalAnalysisContent {
  descripcion_tecnica: string;
  hallazgos_principales: string[];
  triaje_riesgo: RiskLevel;
  analisis_abcde_detalle: string;
  especialista_recomendado: SpecialistType;
  guia_de_consulta: string[];
  pasos_a_seguir: string;
  aviso_legal: string;
}

export interface MedicationAnalysisContent {
  nombre_detectado: string;
  concentracion: string;
  para_que_sirve: string;
  como_se_toma: string;
  advertencias_clave: string[];
  efectos_secundarios_comunes: string[];
  aviso_legal: string;
}

export type AnalysisResult = {
  id: string;
  timestamp: number;
  scanType: ScanType;
  imageUri: string;
} & (MedicalAnalysisContent | MedicationAnalysisContent);

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  scanType: ScanType;
  imageUri: string;
  riskLevel: RiskLevel;
  summary: string;
}

export interface WoundComparison {
  previousImageUri?: string;
  previousTimestamp?: number;
  areaChange?: number; // Percentage change in wound area
  healingProgress?: 'improving' | 'stable' | 'worsening';
}

export interface ClassificationResult {
  detectedZone: string;
  confidence: number;
  recommendedModule: ScanType;
  summary: string;
  findings: string[];
}
