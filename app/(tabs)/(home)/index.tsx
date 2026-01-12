import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import SmartScanCard from '@/components/home/SmartScanCard';
import QuickScanGrid from '@/components/home/QuickScanGrid';
import MedicalDisclaimer from '@/components/home/MedicalDisclaimer';
import PhotoGuideModal from '@/components/home/PhotoGuideModal';
import ToolsCarousel from '@/components/home/ToolsCarousel';
import { router } from 'expo-router';
import { ScanType } from '@/types/analysis';
import { Bot } from 'lucide-react-native';
import { UserService } from '@/services/userService';
import { UserProfile } from '@/types/user';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [showPhotoGuide, setShowPhotoGuide] = useState(false);
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('skin');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        const profile = await UserService.getProfile();
        setUserProfile(profile);
      };
      loadProfile();
    }, [])
  );

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

  const handleLabScan = () => {
    router.push({ pathname: '/scan', params: { type: 'lab_results' } });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeHeader
          userName={userProfile?.nombre || "Usuario"}
          onPressAvatar={() => router.push('/profile')}
        />

        <SmartScanCard onPress={handleSmartScan} />

        <ToolsCarousel
          onToolPress={(type) => router.push({ pathname: '/scan', params: { type } })}
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
    bottom: 90, // Lifted above absolute Tab Bar
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6366F1', // Indigo Brand Blue
    justifyContent: 'center',
    alignItems: 'center',
    // Premium floating shadow
    shadowColor: '#6366F1', // Indigo Shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
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
