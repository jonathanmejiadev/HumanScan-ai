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
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useScanHistory } from '@/hooks/useScanHistory';
import { RiskLevel } from '@/types/analysis';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import { MODULES } from '@/constants/modules';

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
      await Share.share({
        message: `Resultado de Análisis HumanScan\n\nTipo: ${result.scanType === 'skin' ? 'Dermatológico' : 'Ocular'}\nRiesgo: ${result.triaje_riesgo}\n\nHallazgos:\n${result.hallazgos_principales.join('\n')}\n\nEspecialista recomendado: ${result.especialista_recomendado}\n\n${result.aviso_legal}`,
      });
    } catch (error) {
      console.error('[ResultScreen] Share error:', error);
    }
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
              <Scan color={Colors.textMuted} size={48} />
            </View>
          )}
          <View style={[styles.scanTypeBadge, { backgroundColor: moduleConfig.accentColor }]}>
            <Scan color={Colors.textInverse} size={14} />
            <Text style={styles.scanTypeText}>
              {moduleConfig.name}
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={getRiskGradient(result.triaje_riesgo)}
          style={styles.riskCard}
        >
          <View style={styles.riskHeader}>
            <Text style={styles.riskLabel}>Nivel de Riesgo</Text>
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(result.triaje_riesgo) }]}>
              <Text style={styles.riskBadgeText}>{result.triaje_riesgo}</Text>
            </View>
          </View>
          <Text style={[styles.riskMessage, { color: getRiskColor(result.triaje_riesgo) }]}>
            {getRiskMessage(result.triaje_riesgo)}
          </Text>
        </LinearGradient>

        <CollapsibleSection
          title="Descripción Técnica"
          icon={<ClipboardList color={Colors.primary} size={20} />}
        >
          <Text style={styles.descriptionText}>{result.descripcion_tecnica}</Text>
        </CollapsibleSection>

        <CollapsibleSection
          title="Hallazgos Principales"
          icon={<AlertTriangle color={Colors.warning} size={20} />}
        >
          {result.hallazgos_principales.map((hallazgo, index) => (
            <View key={index} style={styles.findingItem}>
              <View style={styles.findingBullet} />
              <Text style={styles.findingText}>{hallazgo}</Text>
            </View>
          ))}
        </CollapsibleSection>

        {result.analisis_abcde_detalle !== 'N/A' && result.analisis_abcde_detalle !== 'N/A - Criterio específico para lesiones cutáneas' && (
          <CollapsibleSection
            title="Análisis ABCDE"
            icon={<Scan color={Colors.skinScan} size={20} />}
            defaultOpen={false}
          >
            <Text style={styles.descriptionText}>{result.analisis_abcde_detalle}</Text>
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
              <Text style={styles.specialistName}>{result.especialista_recomendado}</Text>
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
          {result.guia_de_consulta.map((pregunta, index) => (
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
          <Text style={styles.descriptionText}>{result.pasos_a_seguir}</Text>
        </CollapsibleSection>

        <View style={styles.disclaimerSection}>
          <View style={styles.disclaimerIcon}>
            <Shield color={Colors.warning} size={24} />
          </View>
          <Text style={styles.disclaimerTitle}>Aviso Legal Importante</Text>
          <Text style={styles.disclaimerText}>{result.aviso_legal}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
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
    paddingBottom: 120,
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
});
