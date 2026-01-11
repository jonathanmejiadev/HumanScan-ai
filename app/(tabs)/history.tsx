import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Clock, Scan, Eye, ChevronRight, Inbox } from 'lucide-react-native';
import { useScanHistory } from '@/hooks/useScanHistory';
import Colors from '@/constants/colors';
import { AnalysisResult, RiskLevel } from '@/types/analysis';

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

function HistoryItem({ item }: { item: AnalysisResult }) {
  const handlePress = () => {
    router.push({ pathname: '/result', params: { id: item.id } });
  };

  return (
    <TouchableOpacity
      style={styles.historyCard}
      onPress={handlePress}
      activeOpacity={0.7}
      testID={`history-item-${item.id}`}
    >
      <View style={styles.imageContainer}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderImage}>
            {item.scanType === 'skin' ? (
              <Scan color={Colors.textMuted} size={24} />
            ) : (
              <Eye color={Colors.textMuted} size={24} />
            )}
          </View>
        )}
        <View style={[styles.typeIndicator, { backgroundColor: item.scanType === 'skin' ? Colors.skinScan : Colors.eyeScan }]}>
          {item.scanType === 'skin' ? (
            <Scan color={Colors.textInverse} size={12} />
          ) : (
            <Eye color={Colors.textInverse} size={12} />
          )}
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.scanType === 'skin' ? 'Análisis Dermatológico' : 'Análisis Ocular'}
          </Text>
          <View style={[styles.riskBadge, { backgroundColor: getRiskBgColor(item.triaje_riesgo) }]}>
            <Text style={[styles.riskText, { color: getRiskColor(item.triaje_riesgo) }]}>
              {item.triaje_riesgo}
            </Text>
          </View>
        </View>

        <Text style={styles.findingsText} numberOfLines={2}>
          {item.hallazgos_principales.slice(0, 2).join(', ')}
        </Text>

        <View style={styles.dateRow}>
          <Clock color={Colors.textMuted} size={12} />
          <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
        </View>
      </View>

      <ChevronRight color={Colors.textMuted} size={20} />
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const { history, isLoading, refresh } = useScanHistory();

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Inbox color={Colors.textMuted} size={48} />
      </View>
      <Text style={styles.emptyTitle}>Sin escaneos</Text>
      <Text style={styles.emptySubtitle}>
        Los análisis que realices aparecerán aquí
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial</Text>
        <Text style={styles.headerSubtitle}>
          {history.length} {history.length === 1 ? 'escaneo' : 'escaneos'} guardados
        </Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryItem item={item} />}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: 20,
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
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
