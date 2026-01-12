import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SmartScanCardProps {
    onPress: () => void;
}

export default function SmartScanCard({ onPress }: SmartScanCardProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <LinearGradient
                colors={['#6366F1', '#8B5CF6']} // Indigo to Violet
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                {/* Main Content Area */}
                <View style={styles.contentWrapper}>
                    <View style={styles.mainContent}>
                        <View style={styles.textContent}>
                            <Text style={styles.title}>Análisis Universal</Text>
                            <Text style={styles.description}>
                                Identifica y analiza cualquier anomalía de salud al instante
                            </Text>
                        </View>
                    </View>

                    {/* Bottom Action Area */}
                    <View style={styles.footer}>
                        <View style={styles.startButton}>
                            <Text style={styles.startButtonText}>Escanear ahora</Text>
                            <ChevronRight size={16} color="#FFFFFF" strokeWidth={3} />
                        </View>
                    </View>
                </View>

                {/* Decorative Elements */}
                <View style={styles.decorativeIcon}>
                    <Sparkles size={80} color="rgba(255, 255, 255, 0.15)" strokeWidth={1} />
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
        height: 144, // Reduced height (160 * 0.9)
        overflow: 'hidden',
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'center', // Center content vertically
        zIndex: 2,
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    textContent: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.95)',
        lineHeight: 18,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 4,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    decorativeIcon: {
        position: 'absolute',
        right: -10,
        top: -10,
        zIndex: 1,
    },
});
