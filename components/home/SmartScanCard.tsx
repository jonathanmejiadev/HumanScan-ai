import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SecurityBadge from './SecurityBadge';

interface SmartScanCardProps {
    onPress: () => void;
}

export default function SmartScanCard({ onPress }: SmartScanCardProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <LinearGradient
                colors={['#2563EB', '#1D4ED8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <View style={styles.header}>
                    <View style={styles.statusContainer}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Sistema Online</Text>
                    </View>
                    <View style={styles.securityBadgeWrapper}>
                        <SecurityBadge />
                    </View>
                </View>

                <View style={styles.iconContainer}>
                    <Zap size={32} color="#FFFFFF" fill="#FFFFFF" />
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>Escaneo Rápido con IA</Text>
                    <Text style={styles.description}>
                        Identificación instantánea de lesiones o irritaciones
                    </Text>
                    <Text style={styles.lastAnalysis}>Último análisis: Hoy</Text>
                </View>

                <View style={styles.decorativeIcon}>
                    <Sparkles size={80} color="rgba(255, 255, 255, 0.08)" strokeWidth={2} />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 16,
        borderRadius: 24,
        padding: 20,
        minHeight: 200,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingTop: 16,
        paddingHorizontal: 12,
        zIndex: 2,
        gap: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
        flexShrink: 0,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    securityBadgeWrapper: {
        flexShrink: 1,
        maxWidth: '55%',
        alignItems: 'flex-end',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        zIndex: 1,
    },
    content: {
        zIndex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        lineHeight: 22,
        maxWidth: '90%',
        marginBottom: 12,
    },
    lastAnalysis: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
    },
    decorativeIcon: {
        position: 'absolute',
        right: -20,
        bottom: -20,
    },
});
