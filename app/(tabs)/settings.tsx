import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,

} from 'react-native';
import {
  Shield,
  FileText,
  Trash2,
  AlertTriangle,
  Heart,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { useScanHistory } from '@/hooks/useScanHistory';
import Colors from '@/constants/colors';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
  showChevron?: boolean;
}

function SettingsItem({ icon, title, subtitle, onPress, destructive, showChevron = true }: SettingsItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.settingsIcon, destructive && styles.destructiveIcon]}>
        {icon}
      </View>
      <View style={styles.settingsContent}>
        <Text style={[styles.settingsTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.settingsSubtitle}>{subtitle}</Text>
        )}
      </View>
      {showChevron && <ChevronRight color={Colors.textMuted} size={20} />}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { clearHistory, history } = useScanHistory();

  const handleClearHistory = () => {
    Alert.alert(
      'Eliminar Historial',
      '¿Estás seguro de que deseas eliminar todo el historial de escaneos? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            Alert.alert('Historial eliminado', 'Se han eliminado todos los escaneos.');
          },
        },
      ]
    );
  };

  const showDisclaimer = () => {
    Alert.alert(
      'Aviso Legal',
      'ESTA HERRAMIENTA NO PROPORCIONA UN DIAGNÓSTICO MÉDICO.\n\nSu propósito es puramente informativo y educativo. Los resultados mostrados son orientativos y no sustituyen la evaluación de un profesional de la salud.\n\nEs obligatorio consultar a un médico para obtener un diagnóstico y tratamiento profesional.\n\nNo tome decisiones médicas basándose únicamente en los resultados de esta aplicación.',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'Acerca de HumanScan',
      'HumanScan Engine es una herramienta de triaje digital diseñada para proporcionar orientación preliminar sobre afecciones dermatológicas y oculares.\n\nUtiliza análisis visual asistido por IA para identificar patrones y anomalías, categorizando el nivel de riesgo y proporcionando una guía de consulta para facilitar la comunicación con profesionales médicos.\n\nVersión 1.0.0',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacidad',
      'HumanScan respeta tu privacidad:\n\n• Las imágenes se procesan de forma segura y no se almacenan en servidores externos permanentemente.\n\n• El historial se guarda localmente en tu dispositivo.\n\n• No compartimos tu información con terceros.\n\n• Puedes eliminar tu historial en cualquier momento.',
      [{ text: 'Entendido' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajustes</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INFORMACIÓN</Text>
        <View style={styles.sectionContent}>
          <SettingsItem
            icon={<Info color={Colors.primary} size={20} />}
            title="Acerca de"
            subtitle="Versión 1.0.0"
            onPress={showAbout}
          />
          <SettingsItem
            icon={<Shield color={Colors.secondary} size={20} />}
            title="Privacidad"
            subtitle="Cómo manejamos tus datos"
            onPress={handlePrivacyPolicy}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LEGAL</Text>
        <View style={styles.sectionContent}>
          <SettingsItem
            icon={<AlertTriangle color={Colors.warning} size={20} />}
            title="Aviso Legal"
            subtitle="Lee antes de usar"
            onPress={showDisclaimer}
          />
          <SettingsItem
            icon={<FileText color={Colors.info} size={20} />}
            title="Términos de Uso"
            onPress={() => {
              Alert.alert(
                'Términos de Uso',
                'Al utilizar HumanScan, aceptas que:\n\n1. Los resultados son orientativos y no constituyen diagnóstico médico.\n\n2. Debes consultar a un profesional de salud para cualquier preocupación médica.\n\n3. No utilizarás esta aplicación como sustituto de atención médica profesional.\n\n4. Eres responsable de las decisiones médicas que tomes.',
                [{ text: 'Aceptar' }]
              );
            }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATOS</Text>
        <View style={styles.sectionContent}>
          <SettingsItem
            icon={<Trash2 color={Colors.riskHigh} size={20} />}
            title="Eliminar Historial"
            subtitle={`${history.length} escaneos guardados`}
            onPress={handleClearHistory}
            destructive
          />
        </View>
      </View>

      <View style={styles.disclaimerBanner}>
        <Heart color={Colors.riskHigh} size={20} />
        <Text style={styles.disclaimerBannerText}>
          Cuida tu salud. Ante cualquier síntoma o preocupación, consulta siempre a un profesional médico.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveIcon: {
    backgroundColor: Colors.riskHighBg,
  },
  settingsContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  destructiveText: {
    color: Colors.riskHigh,
  },
  settingsSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    margin: 20,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disclaimerBannerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
