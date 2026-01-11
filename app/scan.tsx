import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageIcon, X, Scan, Eye, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation } from '@tanstack/react-query';
import Colors from '@/constants/colors';
import { analyzeImage } from '@/services/analysisService';
import { useScanHistory } from '@/hooks/useScanHistory';
import { ScanType, AnalysisResult } from '@/types/analysis';

import { MODULES } from '@/constants/modules';

export default function ScanScreen() {
  const { type } = useLocalSearchParams<{ type: ScanType }>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const { addToHistory } = useScanHistory();

  const scanType = (type as ScanType) || 'skin';
  const moduleConfig = MODULES[scanType];

  const analysisMutation = useMutation({
    mutationFn: async () => {
      if (!imageBase64) throw new Error('No image selected');
      console.log('[ScanScreen] Starting analysis...');
      return analyzeImage(imageBase64, scanType);
    },
    onSuccess: async (result) => {
      console.log('[ScanScreen] Analysis successful:', result);
      const id = `scan_${Date.now()}`;
      const fullResult: AnalysisResult = {
        id,
        timestamp: Date.now(),
        scanType,
        imageUri: imageUri || '',
        ...result,
      };
      await addToHistory(fullResult);
      router.replace({ pathname: '/result', params: { id } });
    },
    onError: (error) => {
      console.error('[ScanScreen] Analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

      Alert.alert(
        'Error de Análisis',
        errorMessage,
        [{ text: 'Entendido' }]
      );
    },
  });

  const pickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permiso Requerido',
          `Necesitamos acceso a ${useCamera ? 'la cámara' : 'la galería'} para continuar.`
        );
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          base64: true,
        })
        : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          base64: true,
        });

      if (!result.canceled && result.assets[0]) {
        console.log('[ScanScreen] Image selected');
        setImageUri(result.assets[0].uri);
        setImageBase64(result.assets[0].base64 || null);
      }
    } catch (error) {
      console.error('[ScanScreen] Error picking image:', error);
      Alert.alert('Error', 'No se pudo obtener la imagen. Intenta de nuevo.');
    }
  };

  const resetImage = () => {
    setImageUri(null);
    setImageBase64(null);
  };

  const handleAnalyze = () => {
    if (!imageBase64) {
      Alert.alert('Selecciona una imagen', 'Por favor, captura o selecciona una imagen para analizar.');
      return;
    }
    analysisMutation.mutate();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Análisis ${moduleConfig.name}`,
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <X color={Colors.text} size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.typeIndicator}>
          <LinearGradient
            colors={[moduleConfig.color, moduleConfig.color]}
            style={styles.typeGradient}
          >
            <View style={[styles.typeIcon, { backgroundColor: moduleConfig.accentColor }]}>
              <Scan color={Colors.textInverse} size={24} />
            </View>
            <Text style={styles.typeTitle}>
              {moduleConfig.name}
            </Text>
            <Text style={styles.typeDescription}>
              {moduleConfig.instructions}
            </Text>
          </LinearGradient>
        </View>

        {imageUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <TouchableOpacity style={styles.resetButton} onPress={resetImage}>
              <RotateCcw color={Colors.textInverse} size={20} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.captureSection}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => pickImage(true)}
              activeOpacity={0.8}
            >
              <View style={styles.captureIconContainer}>
                <Camera color={Colors.primary} size={32} />
              </View>
              <Text style={styles.captureButtonTitle}>Usar Cámara</Text>
              <Text style={styles.captureButtonSubtitle}>Tomar foto ahora</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => pickImage(false)}
              activeOpacity={0.8}
            >
              <View style={styles.captureIconContainer}>
                <ImageIcon color={Colors.primary} size={32} />
              </View>
              <Text style={styles.captureButtonTitle}>Galería</Text>
              <Text style={styles.captureButtonSubtitle}>Seleccionar imagen</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Consejos para mejores resultados</Text>
          <View style={styles.tipItem}>
            <CheckCircle color={Colors.secondary} size={16} />
            <Text style={styles.tipText}>Buena iluminación natural</Text>
          </View>
          <View style={styles.tipItem}>
            <CheckCircle color={Colors.secondary} size={16} />
            <Text style={styles.tipText}>Imagen enfocada y sin movimiento</Text>
          </View>
          <View style={styles.tipItem}>
            <CheckCircle color={Colors.secondary} size={16} />
            <Text style={styles.tipText}>Zona a analizar visible y centrada</Text>
          </View>
        </View>

        <View style={styles.warningBanner}>
          <AlertCircle color={Colors.warning} size={18} />
          <Text style={styles.warningText}>
            Los resultados son orientativos. Consulta siempre a un profesional médico.
          </Text>
        </View>
      </ScrollView>

      {imageUri && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.analyzeButton, analysisMutation.isPending && styles.analyzeButtonDisabled]}
            onPress={handleAnalyze}
            disabled={analysisMutation.isPending}
            activeOpacity={0.8}
          >
            {analysisMutation.isPending ? (
              <>
                <ActivityIndicator color={Colors.textInverse} size="small" />
                <Text style={styles.analyzeButtonText}>Analizando...</Text>
              </>
            ) : (
              <>
                <Scan color={Colors.textInverse} size={20} />
                <Text style={styles.analyzeButtonText}>Iniciar Análisis</Text>
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
  headerButton: {
    padding: 8,
    marginLeft: Platform.OS === 'ios' ? 0 : -8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  typeIndicator: {
    marginBottom: 24,
  },
  typeGradient: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  typeTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
  },
  resetButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  captureButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  captureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  captureButtonTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  captureButtonSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tipsSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warningBg,
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: Colors.text,
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
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  analyzeButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textInverse,
  },
});
