import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Pressable,
} from 'react-native';
import { X, Camera, CheckCircle2, XCircle, Lightbulb } from 'lucide-react-native';
import { ScanType } from '@/types/analysis';
import { MODULES } from '@/constants/modules';

interface PhotoGuideModalProps {
    visible: boolean;
    scanType: ScanType;
    onClose: () => void;
    onContinue: () => void;
}

export default function PhotoGuideModal({
    visible,
    scanType,
    onClose,
    onContinue,
}: PhotoGuideModalProps) {
    const module = MODULES[scanType];

    const getGuideContent = () => {
        switch (scanType) {
            case 'skin':
                return {
                    title: 'Guía para Fotografía Dermatológica',
                    tips: [
                        'Asegúrate de tener buena iluminación natural o blanca',
                        'Centra la lesión en el marco rectangular',
                        'Mantén la cámara a 15-20 cm de distancia',
                        'Evita sombras sobre la zona a fotografiar',
                        'Incluye una referencia de tamaño si es posible',
                    ],
                    protocol: 'Protocolo ABCDE: Asimetría, Bordes, Color, Diámetro, Evolución',
                };
            case 'ocular':
                return {
                    title: 'Guía para Fotografía Ocular',
                    tips: [
                        'Abre bien el ojo sin forzarlo',
                        'Centra la pupila en el círculo guía',
                        'Mira directamente a la cámara',
                        'Evita el flash directo',
                        'Mantén el ojo relajado y sin parpadear',
                    ],
                    protocol: 'Protocolos especializados de salud ocular',
                };
            default:
                return {
                    title: 'Guía de Fotografía',
                    tips: [module.instructions],
                    protocol: '',
                };
        }
    };

    const content = getGuideContent();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: module.color },
                                ]}
                            >
                                <Camera size={24} color={module.accentColor} />
                            </View>
                            <Text style={styles.title}>{content.title}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {content.protocol && (
                            <View style={styles.protocolBanner}>
                                <Lightbulb size={20} color="#3B82F6" />
                                <Text style={styles.protocolText}>{content.protocol}</Text>
                            </View>
                        )}

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Consejos para mejores resultados:</Text>
                            {content.tips.map((tip, index) => (
                                <View key={index} style={styles.tipItem}>
                                    <CheckCircle2 size={18} color="#10B981" />
                                    <Text style={styles.tipText}>{tip}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Evita:</Text>
                            <View style={styles.tipItem}>
                                <XCircle size={18} color="#EF4444" />
                                <Text style={styles.tipText}>Fotos borrosas o desenfocadas</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <XCircle size={18} color="#EF4444" />
                                <Text style={styles.tipText}>Iluminación insuficiente o excesiva</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <XCircle size={18} color="#EF4444" />
                                <Text style={styles.tipText}>Ángulos muy inclinados</Text>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: module.accentColor }]}
                            onPress={onContinue}
                            activeOpacity={0.8}
                        >
                            <Camera size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Entendido, continuar</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    protocolBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        gap: 12,
    },
    protocolText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#1E40AF',
        lineHeight: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 10,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
