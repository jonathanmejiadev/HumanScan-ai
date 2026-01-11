import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Scan, ChevronRight, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SmartScanCardProps {
    onPress: () => void;
}

export default function SmartScanCard({ onPress }: SmartScanCardProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <LinearGradient
                colors={['#1E40AF', '#7C3AED']} // Deep Cobalt Blue to Electric Violet
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                {/* Main Content Area */}
                <View style={styles.mainContent}>
                    <View style={styles.iconContainer}>
                        <Scan size={32} color="#FFFFFF" strokeWidth={2.5} />
                        {/* Glow Effect simulation */}
                        <View style={styles.iconGlow} />
                    </View>

                    <View style={styles.textContent}>
                        <Text style={styles.title}>Análisis Universal IA</Text>
                        <Text style={styles.description}>
                            Apunta a cualquier zona y deja que la IA identifique y analice el problema por ti.
                        </Text>
                    </View>
                </View>

                {/* Bottom Action Area */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={onPress}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.startButtonText}>Iniciar</Text>
                        <ChevronRight size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Decorative Elements */}
                <View style={styles.decorativeIcon}>
                    <Sparkles size={100} color="rgba(255, 255, 255, 0.1)" strokeWidth={1} />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 12,
        borderRadius: 24,
        padding: 20,
        minHeight: 160, // Reduced height by 20%
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        zIndex: 2,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        position: 'relative',
    },
    iconGlow: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        opacity: 0.2,
        zIndex: -1,
    },
    textContent: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 20,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 2,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 4,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    decorativeIcon: {
        position: 'absolute',
        right: -30,
        top: -30,
        zIndex: 1,
    },
});
