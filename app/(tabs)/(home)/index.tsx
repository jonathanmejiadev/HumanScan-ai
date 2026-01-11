import React from 'react';
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
import { router } from 'expo-router';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const handleSmartScan = () => {
    // Navigate to smart scan selection
    console.log('[HomeScreen] Smart scan pressed');
    router.push({ pathname: '/scan', params: { type: 'skin' } });
  };

  const handleVirtualAssistant = () => {
    // Navigate to virtual assistant
    console.log('[HomeScreen] Virtual assistant pressed');
    // TODO: Implement virtual assistant navigation
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeHeader userName="Carlos" />

        <SmartScanCard onPress={handleSmartScan} />

        <QuickScanGrid />

        <VirtualAssistant onPress={handleVirtualAssistant} />

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
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
