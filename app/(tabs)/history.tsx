import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import {
  Clock,
  ChevronRight,
  Inbox,
  Trash2,
  Pill,
  Sparkles,
  Stethoscope,
  Apple,
  Microscope,
  PlusCircle,
  FileDown,
  Circle,
  CheckCircle2,
  X
} from 'lucide-react-native';
import { useScanHistory } from '@/hooks/useScanHistory';
import { UserService } from '@/services/userService';
import { PDFService } from '@/services/pdfService';
import { UserProfile } from '@/types/user';
import Colors from '@/constants/colors';
import { AnalysisResult, RiskLevel, ScanType } from '@/types/analysis';
import { MODULES } from '@/constants/modules';
import CategoryIcon from '@/components/shared/CategoryIcon';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FilterType = 'all' | 'medical' | 'medication' | 'nutrition' | 'lab_results';

interface FilterChip {
  id: FilterType;
  label: string;
  icon: any;
}

const FILTERS: FilterChip[] = [
  { id: 'all', label: 'Todos', icon: Sparkles },
  { id: 'medical', label: 'Médico', icon: Stethoscope },
  { id: 'medication', label: 'Medicamentos', icon: Pill },
  { id: 'nutrition', label: 'Nutrición', icon: Apple },
  { id: 'lab_results', label: 'Análisis', icon: Microscope },
];

const MEDICAL_TYPES: ScanType[] = [
  'skin', 'ocular', 'dental', 'posture', 'nails', 'wound',
  'capillary', 'throat', 'veins', 'pediatrics', 'intimate', 'bites'
];

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'Bajo': return Colors.riskLow;
    case 'Medio': return Colors.riskMedium;
    case 'Alto': return Colors.riskHigh;
    case 'Emergencia': return Colors.riskEmergency;
    default: return Colors.textMuted;
  }
};

const getRiskBgColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'Bajo': return Colors.riskLowBg;
    case 'Medio': return Colors.riskMediumBg;
    case 'Alto': return Colors.riskHighBg;
    case 'Emergencia': return Colors.riskEmergencyBg;
    default: return Colors.surfaceAlt;
  }
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function HistoryItem({
  item,
  onDelete,
  isSelectionMode,
  isSelected,
  onToggleSelection
}: {
  item: AnalysisResult;
  onDelete: (id: string) => void;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
}) {
  const handlePress = () => {
    if (isSelectionMode) {
      onToggleSelection(item.id);
    } else {
      router.push({ pathname: '/result', params: { id: item.id } });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar análisis',
      '¿Estás seguro de que deseas eliminar este análisis? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(item.id)
        }
      ]
    );
  };

  const moduleInfo = MODULES[item.scanType];

  return (
    <TouchableOpacity
      style={styles.historyCard}
      onPress={handlePress}
      activeOpacity={0.7}
      testID={`history-item-${item.id}`}
    >
      {isSelectionMode && (
        <View style={styles.selectionIndicator}>
          {isSelected ? (
            <CheckCircle2 size={24} color={Colors.primary} fill={Colors.primary + '20'} />
          ) : (
            <Circle size={24} color={Colors.border} />
          )}
        </View>
      )}
      <View style={styles.imageContainer}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderImage}>
            <CategoryIcon scanType={item.scanType} color={Colors.textMuted} size={24} />
          </View>
        )}
        <View style={[styles.typeIndicator, { backgroundColor: moduleInfo.accentColor }]}>
          <CategoryIcon scanType={item.scanType} color={Colors.textInverse} size={12} />
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.scanType === 'medication' ? 'Medicamento' : item.scanType === 'nutrition' ? 'Alimento' : item.scanType === 'lab_results' ? 'Estudios' : `Análisis ${moduleInfo.name}`}
          </Text>
          {item.scanType !== 'medication' && item.scanType !== 'nutrition' && item.scanType !== 'lab_results' && (
            <View style={[styles.riskBadge, { backgroundColor: getRiskBgColor((item as any).triaje_riesgo) }]}>
              <Text style={[styles.riskText, { color: getRiskColor((item as any).triaje_riesgo) }]}>
                {(item as any).triaje_riesgo}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.findingsText} numberOfLines={2}>
          {item.scanType === 'medication'
            ? `${(item as any).nombre_detectado} - ${(item as any).concentracion}`
            : item.scanType === 'nutrition'
              ? `${(item as any).nombre_plato} - ${(item as any).calorias_aprox}`
              : item.scanType === 'lab_results'
                ? `${(item as any).tipo_estudio} - ${(item as any).fecha_detectada || 'Reciente'}`
                : (item as any).hallazgos_principales?.slice(0, 2).join(', ') || ''}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.dateRow}>
            <Clock color={Colors.textMuted} size={12} />
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          </View>

          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 color={Colors.riskHigh} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <ChevronRight color={Colors.textMuted} size={20} />
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const { history, isLoading, refresh, removeFromHistory } = useScanHistory();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await UserService.getProfile();
      setUserProfile(profile);
    };
    loadProfile();
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleGeneratePdf = async () => {
    if (selectedIds.length === 0) return;

    setIsGeneratingPdf(true);
    try {
      const selectedResults = history.filter(item => selectedIds.includes(item.id));
      await PDFService.generateHistoryReport(selectedResults, userProfile);

      // Reset after export
      setIsSelectionMode(false);
      setSelectedIds([]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el reporte PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const filteredHistory = useMemo(() => {
    switch (activeFilter) {
      case 'medical':
        return history.filter(item => MEDICAL_TYPES.includes(item.scanType));
      case 'medication':
        return history.filter(item => item.scanType === 'medication');
      case 'nutrition':
        return history.filter(item => item.scanType === 'nutrition');
      case 'lab_results':
        return history.filter(item => item.scanType === 'lab_results');
      default:
        return history;
    }
  }, [history, activeFilter]);

  const handleFilterChange = (filterId: FilterType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveFilter(filterId);
  };

  const getFilterCategoryName = (id: FilterType) => {
    return FILTERS.find(f => f.id === id)?.label || '';
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Inbox color={Colors.textMuted} size={48} />
      </View>
      <Text style={styles.emptyTitle}>
        {activeFilter === 'all'
          ? 'Sin escaneos'
          : `No hay registros en ${getFilterCategoryName(activeFilter)}`}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeFilter === 'all'
          ? 'Los análisis que realices aparecerán aquí'
          : `Aún no tienes registros en esta categoría`}
      </Text>
      <TouchableOpacity
        style={styles.emptyAction}
        onPress={() => router.push('/(tabs)/(home)')}
      >
        <PlusCircle size={20} color={Colors.primary} />
        <Text style={styles.emptyActionText}>Realizar primer escaneo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Historial</Text>
          <TouchableOpacity
            style={[styles.selectToggle, isSelectionMode && styles.selectToggleActive]}
            onPress={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedIds([]);
            }}
          >
            {isSelectionMode ? (
              <X size={18} color={Colors.text} />
            ) : (
              <Text style={styles.selectToggleText}>Seleccionar</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive
                ]}
                onPress={() => handleFilterChange(filter.id)}
                activeOpacity={0.8}
              >
                <Icon size={16} color={isActive ? '#FFF' : Colors.textSecondary} />
                <Text style={[
                  styles.filterLabel,
                  isActive && styles.filterLabelActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.resultsCount}>
          Mostrando {filteredHistory.length} resultados de {getFilterCategoryName(activeFilter)}
        </Text>
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoryItem
            item={item}
            onDelete={removeFromHistory}
            isSelectionMode={isSelectionMode}
            isSelected={selectedIds.includes(item.id)}
            onToggleSelection={toggleSelection}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {isSelectionMode && selectedIds.length > 0 && (
        <View style={[styles.fabContainer, { bottom: 110 }]}>
          <TouchableOpacity
            style={styles.pdfFab}
            onPress={handleGeneratePdf}
            disabled={isGeneratingPdf}
            activeOpacity={0.9}
          >
            {isGeneratingPdf ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <FileDown size={20} color="#FFF" />
                <Text style={styles.pdfFabText}>
                  Generar Reporte PDF ({selectedIds.length})
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  selectToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
  },
  selectToggleActive: {
    backgroundColor: Colors.surfaceAlt,
  },
  selectToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  filterScroll: {
    paddingBottom: 12,
  },
  filterContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterLabelActive: {
    color: '#FFF',
  },
  resultsCount: {
    fontSize: 12,
    color: Colors.textMuted,
    paddingHorizontal: 24,
    paddingBottom: 12,
    fontWeight: '500',
  },
  listContent: {
    padding: 20,
    paddingBottom: 150, // More clearance for Tab Bar
    flexGrow: 1,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectionIndicator: {
    marginRight: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
  },
  placeholderImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  findingsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteButton: {
    padding: 2,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  emptyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyActionText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  fabContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  pdfFab: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pdfFabText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

