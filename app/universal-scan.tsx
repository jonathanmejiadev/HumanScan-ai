import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { router, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera as CameraIcon, X, Scan, ChevronRight, Activity, ShieldCheck, Search } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { AIService } from '@/services/aiService';
import { ClassificationResult } from '@/types/analysis';
import { MODULES } from '@/constants/modules';

const { width, height } = Dimensions.get('window');

type ScanStatus = 'idle' | 'capturing' | 'identifying' | 'detected' | 'finished';

export default function UniversalScannerScreen() {
    const [status, setStatus] = useState<ScanStatus>('idle');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [classification, setClassification] = useState<ClassificationResult | null>(null);
    const [displayText, setDisplayText] = useState('Alistando visión inteligente...');

    // Animations
    const scanLineAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (status === 'identifying') {
            startScanningAnimation();
            runClassificationSequence();
        } else {
            scanLineAnim.setValue(0);
        }
    }, [status]);

    const startScanningAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(scanLineAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    };

    const runClassificationSequence = async () => {
        setDisplayText('Buscando patrones...');
        await new Promise(resolve => setTimeout(resolve, 1500));

        setDisplayText('Identificando zona...');
        await new Promise(resolve => setTimeout(resolve, 1500));
    };

    const handlePickImage = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para el escaneo universal.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            // @ts-ignore - Deprecated but necessary for this version
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled && result.assets[0]) {
            setImageUri(result.assets[0].uri);
            setImageBase64(result.assets[0].base64 || null);
            setStatus('identifying');

            try {
                const res = await AIService.classifyImage(result.assets[0].base64!);
                setClassification(res);
                setDisplayText(`Zona detectada: ${res.detectedZone}`);
                setTimeout(() => setStatus('detected'), 2000);
            } catch (error) {
                Alert.alert('Error', 'No se pudo clasificar la imagen. Intenta de nuevo.');
                setStatus('idle');
            }
        }
    };

    const handleGoToDeepAnalysis = () => {
        if (classification?.recommendedModule && imageUri) {
            router.push({
                pathname: '/scan',
                params: {
                    type: classification.recommendedModule,
                    imageUri: imageUri,
                    imageBase64: imageBase64
                }
            });
        }
    };

    const translateY = scanLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.8],
    });

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Toolbar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <X color={Colors.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Escáner Universal IA</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Main Surface */}
            <View style={styles.cameraSurface}>
                {imageUri ? (
                    <View style={styles.previewWrapper}>
                        <Image source={{ uri: imageUri }} style={styles.previewImage} />

                        {status === 'identifying' && (
                            <>
                                <Animated.View style={[styles.scanLine, { top: translateY }]} />
                                <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                            </>
                        )}

                        {/* Visual Markers overlay */}
                        <View style={styles.markersContainer}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.placeholderGrid} onPress={handlePickImage}>
                        <Search size={48} color={Colors.textMuted} />
                        <Text style={styles.placeholderText}>Toca para iniciar visión IA</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* AI Feedback Panel */}
            <View style={styles.feedbackPanel}>
                <View style={styles.statusIndicator}>
                    <Activity size={20} color={status === 'identifying' ? Colors.primary : Colors.secondary} />
                    <Text style={styles.statusText}>{displayText}</Text>
                </View>

                {status === 'detected' && classification && (
                    <Animated.View style={styles.resultDetails}>
                        <LinearGradient
                            colors={['#F0FDFA', '#F8FAFC']}
                            style={styles.resultCard}
                        >
                            <View style={styles.resultHeader}>
                                <ShieldCheck size={24} color={Colors.primary} />
                                <Text style={styles.resultTitle}>Predicción IA</Text>
                            </View>

                            <Text style={styles.detectedLabel}>
                                {classification.detectedZone} ({(classification.confidence * 100).toFixed(0)}% confianza)
                            </Text>

                            <View style={styles.findingsContainer}>
                                {classification.findings.map((f, i) => (
                                    <View key={i} style={styles.findingItem}>
                                        <View style={styles.findingDot} />
                                        <Text style={styles.findingText}>{f}</Text>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={styles.deepAnalysisButton}
                                onPress={handleGoToDeepAnalysis}
                            >
                                <LinearGradient
                                    colors={[Colors.primary, Colors.primaryDark]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientButton}
                                >
                                    <Text style={styles.buttonText}>Ir a análisis profundo</Text>
                                    <ChevronRight size={18} color="#FFFFFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                )}

                {status === 'idle' && (
                    <TouchableOpacity style={styles.primaryActionButton} onPress={handlePickImage}>
                        <CameraIcon size={24} color="#FFFFFF" strokeWidth={2.5} />
                        <Text style={styles.actionButtonText}>Capturar Imagen</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    cameraSurface: {
        width: width * 0.85,
        height: width * 0.85,
        alignSelf: 'center',
        marginTop: 40,
        borderRadius: 30,
        backgroundColor: Colors.surface,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 5,
    },
    previewWrapper: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#000',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    scanLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 10,
    },
    markersContainer: {
        ...StyleSheet.absoluteFillObject,
        padding: 20,
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: Colors.primary,
        borderWidth: 4,
    },
    topLeft: {
        top: 20,
        left: 20,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: 20,
        right: 20,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 20,
        left: 20,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    bottomRight: {
        bottom: 20,
        right: 20,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    placeholderGrid: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    placeholderText: {
        color: Colors.textSecondary,
        fontSize: 15,
        fontWeight: '500',
    },
    feedbackPanel: {
        flex: 1,
        marginTop: 40,
        paddingHorizontal: 20,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: 12,
        borderRadius: 16,
        gap: 10,
        marginBottom: 20,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    statusText: {
        color: Colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    resultDetails: {
        flex: 1,
    },
    resultCard: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    resultTitle: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    detectedLabel: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    findingsContainer: {
        marginBottom: 24,
    },
    findingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    findingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
    },
    findingText: {
        color: Colors.textSecondary,
        fontSize: 13,
    },
    deepAnalysisButton: {
        marginTop: 'auto',
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    primaryActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 18,
        borderRadius: 20,
        gap: 12,
        marginTop: 20,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
