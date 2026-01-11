import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import SmartScanCard from '@/components/home/SmartScanCard';
import QuickScanGrid from '@/components/home/QuickScanGrid';
import VirtualAssistant from '@/components/home/VirtualAssistant';
import MedicalDisclaimer from '@/components/home/MedicalDisclaimer';
import PhotoGuideModal from '@/components/home/PhotoGuideModal';
import { router } from 'expo-router';
import { ScanType } from '@/types/analysis';

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
    const specializedTypes: ScanType[] = ['skin', 'ocular'];

    if (specializedTypes.includes(scanType)) {
      // Show photo guide first for specialized scans
      setSelectedScanType(scanType);
      setShowPhotoGuide(true);
    } else {
      // Navigate directly for other scans
      router.push({ pathname: '/scan', params: { type: scanType } });
    }
  };

  const handleShowGuide = (scanType: ScanType) => {
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

        <QuickScanGrid
          onModulePress={handleModuleScan}
          onHelpPress={handleShowGuide}
        />

        <VirtualAssistant onPress={handleVirtualAssistant} />

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
});
