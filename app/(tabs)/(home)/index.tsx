import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import SmartScanCard from '@/components/home/SmartScanCard';
import QuickScanGrid from '@/components/home/QuickScanGrid';
import MedicalDisclaimer from '@/components/home/MedicalDisclaimer';
import PhotoGuideModal from '@/components/home/PhotoGuideModal';
import MedicationScannerBanner from '@/components/home/MedicationScannerBanner';
import { router } from 'expo-router';
import { ScanType } from '@/types/analysis';
import { Bot } from 'lucide-react-native';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [showPhotoGuide, setShowPhotoGuide] = useState(false);
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('skin');

  const handleSmartScan = () => {
    // Navigate to smart scan with automatic detection (Universal IA)
    console.log('[HomeScreen] Universal scan pressed');
    router.push('/universal-scan');
  };

  const handleModuleScan = (scanType: ScanType) => {
    // Navigate directly for all scans as requested
    router.push({ pathname: '/scan', params: { type: scanType } });
  };

  const handleShowGuide = (scanType: ScanType) => {
    // Optional: guide can still be triggered by the help icon if needed, 
    // but the main flow is now direct.
    setSelectedScanType(scanType);
    setShowPhotoGuide(true);
  };

  const handleContinueFromGuide = () => {
    setShowPhotoGuide(false);
    router.push({ pathname: '/scan', params: { type: selectedScanType } });
  };

  const handleVirtualAssistant = () => {
    // Navigate to virtual assistant
    console.log('[HomeScreen] Virtual assistant pressed');
    router.push('/chat');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeHeader userName="Jonathan" />

        <SmartScanCard onPress={handleSmartScan} />

        <MedicationScannerBanner
          onPress={() => router.push({ pathname: '/scan', params: { type: 'medication' } })}
        />

        <QuickScanGrid
          onModulePress={handleModuleScan}
          onHelpPress={handleShowGuide}
        />

        <MedicalDisclaimer />

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <PhotoGuideModal
        visible={showPhotoGuide}
        scanType={selectedScanType}
        onClose={() => setShowPhotoGuide(false)}
        onContinue={handleContinueFromGuide}
      />

      <TouchableOpacity
        style={[styles.fab]}
        onPress={handleVirtualAssistant}
        activeOpacity={0.9}
      >
        <Bot size={26} color="#FFFFFF" strokeWidth={2} />
        <View style={styles.onlineIndicator} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 100,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
