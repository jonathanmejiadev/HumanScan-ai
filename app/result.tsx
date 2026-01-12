import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Share,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import {
  X,
  AlertTriangle,
  UserCheck,
  ClipboardList,
  MessageCircle,
  Shield,
  Scan,
  Eye,
  Share2,
  ChevronDown,
  ChevronUp,
  Pill,
  Apple,
  Utensils,
  Flame,
  Zap,
  FileText,
  Calendar,
  Beaker,
  Activity,
  Bot,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useScanHistory } from '@/hooks/useScanHistory';
import { RiskLevel } from '@/types/analysis';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import { MODULES } from '@/constants/modules';
import CategoryIcon from '@/components/shared/CategoryIcon';

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'Bajo': return Colors.riskLow;
    case 'Medio': return Colors.riskMedium;
    case 'Alto': return Colors.riskHigh;
    case 'Emergencia': return Colors.riskEmergency;
    default: return Colors.textMuted;
  }
};

const getRiskGradient = (risk: RiskLevel): [string, string] => {
  switch (risk) {
    case 'Bajo': return ['#D1FAE5', '#A7F3D0'];
    case 'Medio': return ['#FEF3C7', '#FDE68A'];
    case 'Alto': return ['#FEE2E2', '#FECACA'];
    case 'Emergencia': return ['#FEE2E2', '#FCA5A5'];
    default: return [Colors.surfaceAlt, Colors.surfaceAlt];
  }
};

const getRiskMessage = (risk: RiskLevel) => {
  switch (risk) {
    case 'Bajo': return 'Seguimiento preventivo recomendado';
    case 'Medio': return 'Consulta médica sugerida';
    case 'Alto': return 'Atención médica prioritaria';
    case 'Emergencia': return 'Atención médica inmediata';
    default: return '';
  }
};

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={styles.sectionTitleRow}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {isOpen ? (
          <ChevronUp color={Colors.textMuted} size={20} />
        ) : (
          <ChevronDown color={Colors.textMuted} size={20} />
        )}
      </TouchableOpacity>
      {isOpen && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
}

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById } = useScanHistory();

  const result = getById(id || '');

  const handleShare = async () => {
    if (!result) return;

    try {
      if (result.scanType === 'medication') {
        const med = result as any;
        await Share.share({
          message: `Identificación de Medicamento - HumanScan\n\nNombre: ${med.nombre_detectado}\nConcentración: ${med.concentracion}\nUso: ${med.para_que_sirve}\n\n${med.aviso_legal}`,
        });
      } else if (result.scanType === 'nutrition') {
        const nut = result as any;
        await Share.share({
          message: `Análisis Nutricional - HumanScan\n\nPlato: ${nut.nombre_plato}\nCalorías: ${nut.calorias_aprox}\nResultado: ${nut.semaforo_salud}\n\nConsejo: ${nut.consejo_nutricional}`,
        });
      } else if (result.scanType === 'lab_results') {
        const lab = result as any;
        await Share.share({
          message: `Análisis de Laboratorio - HumanScan\n\nEstudio: ${lab.tipo_estudio}\nFecha: ${lab.fecha_detectada || 'No detectada'}\n\nResumen: ${lab.resumen_medico}\n\n${lab.aviso_legal}`,
        });
      } else {
        const res = result as any;
        await Share.share({
          message: `Resultado de Análisis HumanScan\n\nTipo: ${result.scanType}\nRiesgo: ${res.triaje_riesgo}\n\nHallazgos:\n${res.hallazgos_principales.join('\n')}\n\nEspecialista recomendado: ${res.especialista_recomendado}\n\n${res.aviso_legal}`,
        });
      }
    } catch (error) {
      console.error('[ResultScreen] Share error:', error);
    }
  };

  const handleAskAI = () => {
    if (!result) return;
    router.push({
      pathname: '/chat',
      params: {
        context: JSON.stringify(result),
        scanType: result.scanType
      }
    });
  };

  if (!result) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Resultado',
            headerStyle: { backgroundColor: Colors.surface },
            headerTintColor: Colors.text,
          }}
        />
        <View style={styles.errorContainer}>
          <AlertTriangle color={Colors.warning} size={48} />
          <Text style={styles.errorTitle}>Resultado no encontrado</Text>
          <Text style={styles.errorSubtitle}>
            El análisis que buscas no está disponible
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.errorButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const moduleConfig = MODULES[result.scanType];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Resultado del Análisis',
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/')} style={styles.headerButton}>
              <X color={Colors.text} size={24} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Share2 color={Colors.primary} size={22} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <LegalDisclaimer />

        <View style={styles.imageSection}>
          {result.imageUri ? (
            <Image source={{ uri: result.imageUri }} style={styles.resultImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <CategoryIcon scanType={result.scanType} color={Colors.textMuted} size={48} />
            </View>
          )}
          <View style={[styles.scanTypeBadge, { backgroundColor: moduleConfig.accentColor }]}>
            <CategoryIcon scanType={result.scanType} color={Colors.textInverse} size={14} />
            <Text style={styles.scanTypeText}>
              {moduleConfig.name}
            </Text>
          </View>
        </View>

        {result.scanType === 'medication' ? (
          <>
            <CollapsibleSection
              title="Identificación del Producto"
              icon={<Pill color={Colors.primary} size={20} />}
            >
              <View style={styles.medicationRow}>
                <Text style={styles.medicationLabel}>Nombre/Principio:</Text>
                <Text style={styles.medicationValue}>{(result as any).nombre_detectado}</Text>
              </View>
              <View style={styles.medicationRow}>
                <Text style={styles.medicationLabel}>Concentración:</Text>
                <Text style={styles.medicationValue}>{(result as any).concentracion}</Text>
              </View>
            </CollapsibleSection>

            <CollapsibleSection
              title="Para qué sirve"
              icon={<ClipboardList color={Colors.info} size={20} />}
            >
              <Text style={styles.descriptionText}>{(result as any).para_que_sirve}</Text>
            </CollapsibleSection>

            <CollapsibleSection
              title="Cómo se toma"
              icon={<UserCheck color={Colors.secondary} size={20} />}
            >
              <Text style={styles.descriptionText}>{(result as any).como_se_toma}</Text>
            </CollapsibleSection>

            <CollapsibleSection
              title="Advertencias Clave"
              icon={<AlertTriangle color={Colors.warning} size={20} />}
            >
              {(result as any).advertencias_clave.map((item: string, index: number) => (
                <View key={index} style={styles.findingItem}>
                  <View style={[styles.findingBullet, { backgroundColor: Colors.warning }]} />
                  <Text style={styles.findingText}>{item}</Text>
                </View>
              ))}
            </CollapsibleSection>

            <CollapsibleSection
              title="Efectos Secundarios"
              icon={<AlertTriangle color={Colors.riskHigh} size={20} />}
              defaultOpen={false}
            >
              {(result as any).efectos_secundarios_comunes.map((item: string, index: number) => (
                <View key={index} style={styles.findingItem}>
                  <View style={[styles.findingBullet, { backgroundColor: Colors.riskHigh }]} />
                  <Text style={styles.findingText}>{item}</Text>
                </View>
              ))}
            </CollapsibleSection>
          </>
        ) : result.scanType === 'nutrition' ? (
          <>
            <View style={[
              styles.riskCard,
              { backgroundColor: (result as any).semaforo_salud === 'Verde' ? '#D1FAE5' : (result as any).semaforo_salud === 'Amarillo' ? '#FEF3C7' : '#FEE2E2' }
            ]}>
              <View style={styles.riskHeader}>
                <Text style={styles.riskLabel}>Semáforo nutricional</Text>
                <View style={[styles.riskBadge, {
                  backgroundColor: (result as any).semaforo_salud === 'Verde' ? Colors.riskLow : (result as any).semaforo_salud === 'Amarillo' ? Colors.riskMedium : Colors.riskHigh
                }]}>
                  <Text style={styles.riskBadgeText}>{(result as any).semaforo_salud}</Text>
                </View>
              </View>
              <Text style={[styles.riskMessage, {
                color: (result as any).semaforo_salud === 'Verde' ? Colors.riskLow : (result as any).semaforo_salud === 'Amarillo' ? Colors.riskMedium : Colors.riskHigh
              }]}>
                {(result as any).nombre_plato}
              </Text>
            </View>

            <CollapsibleSection
              title="Valores Estimados"
              icon={<Flame color={Colors.primary} size={20} />}
            >
              <View style={styles.medicationRow}>
                <Text style={styles.medicationLabel}>Calorías:</Text>
                <Text style={styles.medicationValue}>{(result as any).calorias_aprox}</Text>
              </View>
              <View style={styles.macroGrid}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>Prot</Text>
                  <Text style={styles.macroValue}>{(result as any).macronutrientes.proteinas}</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>Carbs</Text>
                  <Text style={styles.macroValue}>{(result as any).macronutrientes.carbos}</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>Grasas</Text>
                  <Text style={styles.macroValue}>{(result as any).macronutrientes.grasas}</Text>
                </View>
              </View>
            </CollapsibleSection>

            <CollapsibleSection
              title="Análisis del Plato"
              icon={<ClipboardList color={Colors.info} size={20} />}
            >
              <Text style={styles.descriptionText}>{(result as any).analisis_breve}</Text>
            </CollapsibleSection>

            <CollapsibleSection
              title="Consejo Nutricional"
              icon={<Zap color={Colors.secondary} size={20} />}
            >
              <Text style={styles.descriptionText}>{(result as any).consejo_nutricional}</Text>
            </CollapsibleSection>

            <CollapsibleSection
              title="Alertas & Advertencias"
              icon={<AlertTriangle color={Colors.warning} size={20} />}
            >
              {(result as any).advertencias.map((item: string, index: number) => (
                <View key={index} style={styles.findingItem}>
                  <View style={[styles.findingBullet, { backgroundColor: Colors.warning }]} />
                  <Text style={styles.findingText}>{item}</Text>
                </View>
              ))}
            </CollapsibleSection>
          </>
        ) : result.scanType === 'lab_results' ? (
          <>
            <View style={styles.labHeaderCard}>
              <View style={styles.labHeaderRow}>
                <FileText color={Colors.primary} size={24} />
                <View style={styles.labHeaderInfo}>
                  <Text style={styles.labTypeTitle}>{(result as any).tipo_estudio}</Text>
                  <View style={styles.labDateRow}>
                    <Calendar size={14} color={Colors.textMuted} />
                    <Text style={styles.labDateText}>{(result as any).fecha_detectada || 'Fecha no detectada'}</Text>
                  </View>
                </View>
              </View>
            </View>

            <CollapsibleSection
              title="Resultados del Laboratorio"
              icon={<Beaker color={Colors.secondary} size={20} />}
            >
              {(result as any).hallazgos.map((item: any, index: number) => {
                const statusColor =
                  item.estado === 'NORMAL' ? Colors.riskLow :
                    (item.estado === 'ALTO' || item.estado === 'BAJO') ? Colors.riskMedium :
                      item.estado === 'CRITICO' ? Colors.riskHigh : Colors.textMuted;

                return (
                  <View key={index} style={styles.labResultItem}>
                    <View style={styles.labResultMain}>
                      <View style={styles.labResultIndicator}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={styles.paramName}>{item.parametro}</Text>
                      </View>
                      <Text style={[styles.paramValue, { color: statusColor }]}>
                        {item.valor} <Text style={styles.unitText}>{item.unidad}</Text>
                      </Text>
                    </View>
                    <Text style={styles.refRange}>Ref: {item.rango_ref}</Text>
                    {item.explicacion && item.estado !== 'NORMAL' && (
                      <View style={styles.explanationBox}>
                        <Text style={styles.explanationText}>{item.explicacion}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </CollapsibleSection>

            <CollapsibleSection
              title="Resumen Médico"
              icon={<Activity color={Colors.info} size={20} />}
            >
              <Text style={styles.descriptionText}>{(result as any).resumen_medico}</Text>
            </CollapsibleSection>
          </>
        ) : (
          <>
            <LinearGradient
              colors={getRiskGradient((result as any).triaje_riesgo)}
              style={styles.riskCard}
            >
              <View style={styles.riskHeader}>
                <Text style={styles.riskLabel}>Nivel de Riesgo</Text>
                <View style={[styles.riskBadge, { backgroundColor: getRiskColor((result as any).triaje_riesgo) }]}>
                  <Text style={styles.riskBadgeText}>{(result as any).triaje_riesgo}</Text>
                </View>
              </View>
              <Text style={[styles.riskMessage, { color: getRiskColor((result as any).triaje_riesgo) }]}>
                {getRiskMessage((result as any).triaje_riesgo)}
              </Text>
            </LinearGradient>

            <CollapsibleSection
              title="Descripción Técnica"
              icon={<ClipboardList color={Colors.primary} size={20} />}
            >
              <Text style={styles.descriptionText}>{(result as any).descripcion_tecnica}</Text>
            </CollapsibleSection>

            <CollapsibleSection
              title="Hallazgos Principales"
              icon={<AlertTriangle color={Colors.warning} size={20} />}
            >
              {(result as any).hallazgos_principales.map((hallazgo: string, index: number) => (
                <View key={index} style={styles.findingItem}>
                  <View style={styles.findingBullet} />
                  <Text style={styles.findingText}>{hallazgo}</Text>
                </View>
              ))}
            </CollapsibleSection>

            {(result as any).analisis_abcde_detalle !== 'N/A' && (result as any).analisis_abcde_detalle !== 'N/A - Criterio específico para lesiones cutáneas' && (
              <CollapsibleSection
                title="Análisis ABCDE"
                icon={<CategoryIcon scanType="skin" color={Colors.skinScan} size={20} />}
                defaultOpen={false}
              >
                <Text style={styles.descriptionText}>{(result as any).analisis_abcde_detalle}</Text>
              </CollapsibleSection>
            )}

            <CollapsibleSection
              title="Especialista Recomendado"
              icon={<UserCheck color={Colors.secondary} size={20} />}
            >
              <View style={styles.specialistCard}>
                <View style={styles.specialistIcon}>
                  <UserCheck color={Colors.secondary} size={24} />
                </View>
                <View style={styles.specialistInfo}>
                  <Text style={styles.specialistName}>{(result as any).especialista_recomendado}</Text>
                  <Text style={styles.specialistHint}>
                    Agenda una consulta para evaluación profesional
                  </Text>
                </View>
              </View>
            </CollapsibleSection>

            <CollapsibleSection
              title="Guía de Consulta"
              icon={<MessageCircle color={Colors.info} size={20} />}
            >
              <Text style={styles.guideIntro}>
                Preguntas sugeridas para tu consulta médica:
              </Text>
              {(result as any).guia_de_consulta.map((pregunta: string, index: number) => (
                <View key={index} style={styles.questionItem}>
                  <View style={styles.questionNumber}>
                    <Text style={styles.questionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.questionText}>{pregunta}</Text>
                </View>
              ))}
            </CollapsibleSection>

            <CollapsibleSection
              title="Pasos a Seguir"
              icon={<ClipboardList color={Colors.primary} size={20} />}
              defaultOpen={false}
            >
              <Text style={styles.descriptionText}>{(result as any).pasos_a_seguir}</Text>
            </CollapsibleSection>
          </>
        )}

        <View style={styles.disclaimerSection}>
          <View style={styles.disclaimerIcon}>
            <Shield color={Colors.warning} size={24} />
          </View>
          <Text style={styles.disclaimerTitle}>Aviso Legal Importante</Text>
          <Text style={styles.disclaimerText}>{result.aviso_legal || 'ESTA HERRAMIENTA NO PROPORCIONA UN DIAGNÓSTICO MÉDICO.'}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleAskAI}
          activeOpacity={0.8}
        >
          <Bot color={Colors.skinScan} size={20} />
          <Text style={styles.chatButtonText}>Preguntar a la IA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Nuevo Análisis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerButton: {
    padding: 8,
    marginHorizontal: Platform.OS === 'ios' ? 0 : -8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 180, // Increased to account for taller bottom actions
  },
  imageSection: {
    position: 'relative',
    marginBottom: 20,
  },
  resultImage: {
    width: '100%',
    aspectRatio: 1.5,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
  },
  placeholderImage: {
    width: '100%',
    aspectRatio: 1.5,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanTypeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  scanTypeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textInverse,
  },
  riskCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  riskLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  riskBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.textInverse,
  },
  riskMessage: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  sectionContent: {
    padding: 16,
    paddingTop: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  findingBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warning,
    marginTop: 6,
  },
  findingText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  specialistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  specialistIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.riskLowBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialistInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  specialistHint: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  guideIntro: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  questionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumberText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.info,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  labHeaderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  labHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  labHeaderInfo: {
    flex: 1,
  },
  labTypeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  labDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labDateText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  labResultItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  labResultMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labResultIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paramName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  paramValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  unitText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textMuted,
  },
  refRange: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 16,
  },
  explanationBox: {
    marginTop: 8,
    marginLeft: 16,
    padding: 10,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
  },
  explanationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  disclaimerSection: {
    backgroundColor: Colors.warningBg,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  disclaimerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  disclaimerTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textInverse,
  },
  chatButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.skinScan,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.skinScan,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textInverse,
  },
  medicationRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  medicationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  medicationValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  macroItem: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
});
