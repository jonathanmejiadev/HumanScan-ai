import React, { useState, useEffect } from 'react';
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
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Camera, ImageIcon, X, Scan, Eye, AlertCircle, CheckCircle, RotateCcw, ShieldAlert, MessageSquare, FileText } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation } from '@tanstack/react-query';
import Colors from '@/constants/colors';
import { analyzeImage } from '@/services/analysisService';
import { useScanHistory } from '@/hooks/useScanHistory';
import { ScanType, AnalysisResult } from '@/types/analysis';

import { MODULES } from '@/constants/modules';
import CategoryIcon from '@/components/shared/CategoryIcon';

const SPECIALTY_TIPS: Record<string, string> = {
  skin: "Ej: Lo tengo hace años, no ha cambiado...",
  throat: "Ej: Tengo fiebre de 38° y me duele al tragar...",
  intimate: "Ej: Siento ardor pero no hay dolor fuerte...",
  medication: "Ej: Me lo recetaron para la presión...",
  dental: "Ej: Me duele al masticar cosas frías...",
  nails: "Ej: La mancha apareció tras un golpe...",
  wound: "Ej: La herida tiene 3 días y está supurando...",
  ocular: "Ej: Siento como si tuviera arena en el ojo...",
  lab_results: "Ej: Ayuno de 12 horas, medicación previa...",
  default: "Añade cualquier detalle que consideres importante..."
};

export default function ScanScreen() {
  const { type, imageUri: paramUri, imageBase64: paramBase64, mimeType: paramMime } = useLocalSearchParams<{
    type: ScanType,
    imageUri?: string,
    imageBase64?: string,
    mimeType?: string
  }>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [userNotes, setUserNotes] = useState("");
  const { addToHistory } = useScanHistory();

  const scanType = (type as ScanType) || 'skin';
  const moduleConfig = MODULES[scanType];

  const analysisMutation = useMutation({
    mutationFn: async (overrideBase64?: string) => {
      const base64ToUse = overrideBase64 || imageBase64;
      if (!base64ToUse) throw new Error('No image selected');
      console.log('[ScanScreen] Starting analysis with notes:', userNotes, 'Mime:', mimeType);
      return analyzeImage(base64ToUse, scanType, userNotes, mimeType);
    },
    onSuccess: async (result) => {
      console.log('[ScanScreen] Analysis successful:', result);
      const id = `scan_${Date.now()}`;
      const fullResult = {
        id,
        timestamp: Date.now(),
        scanType,
        imageUri: imageUri || '',
        ...result,
      } as any;
      await addToHistory(fullResult);
      router.replace({ pathname: '/result', params: { id } });
    },
    onError: (error) => {
      console.error('[ScanScreen] Analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

      // No mostrar alerta si es un error de seguridad, se maneja en la UI
      if (errorMessage.includes('políticas de seguridad')) return;

      Alert.alert(
        'Error de Análisis',
        errorMessage,
        [{ text: 'Entendido' }]
      );
    },
  });

  const isSafetyError = analysisMutation.error instanceof Error &&
    analysisMutation.error.message.includes('políticas de seguridad');

  // Manejar imagen recibida por parámetros (Skip camera flow)
  useEffect(() => {
    if (paramUri && paramBase64) {
      console.log('[ScanScreen] Archivo recibido desde el exterior context:', paramMime || 'image/jpeg');
      setImageUri(paramUri);
      setImageBase64(paramBase64);
      if (paramMime) setMimeType(paramMime);

      // Disparar análisis automático
      analysisMutation.mutate(paramBase64);
    }
  }, [paramUri, paramBase64, paramMime]);

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
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          base64: true,
        })
        : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
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

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('[ScanScreen] Document selected');
        const fileUri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: 'base64',
        });

        setImageUri(fileUri);
        setImageBase64(base64);
        setMimeType('application/pdf');
      }
    } catch (error) {
      console.error('[ScanScreen] Error picking document:', error);
      Alert.alert('Error', 'No se pudo obtener el documento. Intenta de nuevo.');
    }
  };

  const resetImage = () => {
    setImageUri(null);
    setImageBase64(null);
    setMimeType('image/jpeg');
    setUserNotes("");
  };

  const handleAnalyze = () => {
    if (!imageBase64) {
      Alert.alert('Selecciona una imagen', 'Por favor, captura o selecciona una imagen para analizar.');
      return;
    }
    analysisMutation.mutate(undefined);
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
              <CategoryIcon scanType={scanType} color={Colors.textInverse} size={28} />
            </View>
            <Text style={styles.typeTitle}>
              {moduleConfig.name}
            </Text>
            <Text style={styles.typeDescription}>
              {moduleConfig.instructions}
            </Text>
          </LinearGradient>
        </View>

        {scanType === 'intimate' && !imageUri && (
          <View style={styles.intimateNotice}>
            <AlertCircle color={Colors.primary} size={20} />
            <Text style={styles.intimateNoticeText}>
              Nota: Debido a filtros automáticos de seguridad, intenta que la foto sea lo más específica posible sobre la afección.
            </Text>
          </View>
        )}

        {isSafetyError && (
          <View style={styles.safetyTipsContainer}>
            <View style={styles.safetyTipsHeader}>
              <ShieldAlert color={Colors.riskHigh} size={20} />
              <Text style={styles.safetyTipsTitle}>Consejos de Captura (Políticas IA)</Text>
            </View>
            <Text style={styles.safetyTipsSubtitle}>
              La IA ha bloqueado la imagen por seguridad. Intenta lo siguiente:
            </Text>
            <View style={styles.tipList}>
              <View style={styles.tipItem}>
                <CheckCircle color={Colors.secondary} size={14} />
                <Text style={styles.tipText}><Text style={{ fontWeight: 'bold' }}>Acércate más:</Text> Enfoca la lesión de cerca (macro).</Text>
              </View>
              <View style={styles.tipItem}>
                <CheckCircle color={Colors.secondary} size={14} />
                <Text style={styles.tipText}><Text style={{ fontWeight: 'bold' }}>Iluminación:</Text> Evita sombras y usa luz clara.</Text>
              </View>
              <View style={styles.tipItem}>
                <CheckCircle color={Colors.secondary} size={14} />
                <Text style={styles.tipText}><Text style={{ fontWeight: 'bold' }}>Privacidad:</Text> Menos contexto genital ayuda a evitar filtros restrictivos.</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                resetImage();
                analysisMutation.reset();
              }}
            >
              <Text style={styles.retryButtonText}>Intentar con otra foto</Text>
            </TouchableOpacity>
          </View>
        )}

        {imageUri ? (
          <>
            <View style={styles.previewContainer}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.resetButton} onPress={resetImage}>
                <RotateCcw color={Colors.textInverse} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.notesContainer}>
              <View style={styles.notesHeader}>
                <MessageSquare size={18} color={Colors.primary} />
                <Text style={styles.notesTitle}>Ayuda a la IA con más contexto</Text>
              </View>
              <TextInput
                style={styles.notesInput}
                placeholder={SPECIALTY_TIPS[scanType] || SPECIALTY_TIPS.default}
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
                value={userNotes}
                onChangeText={setUserNotes}
                blurOnSubmit={true}
                returnKeyType="done"
              />
              {userNotes.length > 0 && (
                <Text style={styles.notesIndicator}>
                  <CheckCircle size={10} color={Colors.secondary} /> Se enviará con tu análisis
                </Text>
              )}
            </View>
          </>
        ) : (
          <View style={styles.captureSection}>
            <TouchableOpacity
              style={styles.captureCard}
              onPress={() => pickImage(true)}
              activeOpacity={0.8}
            >
              <View style={styles.captureIconBase}>
                <Camera color={Colors.primary} size={28} />
              </View>
              <View style={styles.captureText}>
                <Text style={styles.captureCardTitle}>Uso de Cámara</Text>
                <Text style={styles.captureCardSubtitle}>Tomar foto ahora</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureCard}
              onPress={() => pickImage(false)}
              activeOpacity={0.8}
            >
              <View style={styles.captureIconBase}>
                <ImageIcon color={Colors.primary} size={28} />
              </View>
              <View style={styles.captureText}>
                <Text style={styles.captureCardTitle}>Galería</Text>
                <Text style={styles.captureCardSubtitle}>Seleccionar imagen</Text>
              </View>
            </TouchableOpacity>

            {scanType === 'lab_results' && (
              <TouchableOpacity
                style={styles.captureCard}
                onPress={pickDocument}
                activeOpacity={0.8}
              >
                <View style={styles.captureIconBase}>
                  <FileText color={Colors.primary} size={28} />
                </View>
                <View style={styles.captureText}>
                  <Text style={styles.captureCardTitle}>Subir PDF</Text>
                  <Text style={styles.captureCardSubtitle}>Seleccionar archivo</Text>
                </View>
              </TouchableOpacity>
            )}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
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
        </KeyboardAvoidingView>
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
    color: '#111827',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    backgroundColor: '#000',
  },
  resetButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  captureSection: {
    gap: 12,
    marginBottom: 24,
  },
  captureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
    gap: 16,
  },
  captureIconBase: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EEF2FF', // Indigo PrimaryLight
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureText: {
    flex: 1,
  },
  captureCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  captureCardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  tipsSection: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#4B5563',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 20,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  analyzeButtonDisabled: {
    backgroundColor: Colors.textMuted,
    shadowOpacity: 0,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  intimateNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  intimateNoticeText: {
    flex: 1,
    fontSize: 13,
    color: '#0369A1',
    lineHeight: 18,
    fontWeight: '500',
  },
  safetyTipsContainer: {
    backgroundColor: '#FEF2F2',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  safetyTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  safetyTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  safetyTipsSubtitle: {
    fontSize: 14,
    color: '#B91C1C',
    marginBottom: 16,
    lineHeight: 20,
  },
  tipList: {
    gap: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  notesContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  notesInput: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 14,
    fontSize: 14,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  notesIndicator: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 10,
    fontWeight: '700',
    textAlign: 'right',
  },
});
