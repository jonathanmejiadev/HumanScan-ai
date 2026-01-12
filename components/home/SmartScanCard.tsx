import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SmartScanCardProps {
    onPress: () => void;
}

export default function SmartScanCard({ onPress }: SmartScanCardProps) {
    return (
        <Pressable onPress={onPress}>
            {({ pressed }) => (
                <LinearGradient
                    colors={['#7C3AED', '#A78BFA']} // Violet Intenso to Lavanda
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.container,
                        pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }
                    ]}
                >
                    {/* Text Content */}
                    <View style={styles.textContent}>
                        <Text style={styles.title}>Análisis Universal IA</Text>
                        <Text style={styles.description} numberOfLines={2}>
                            Identifica y analiza cualquier anomalía de salud al instante.
                        </Text>
                    </View>

                    {/* Circular Action Button */}
                    <View style={styles.actionButton}>
                        <ChevronRight size={22} color="#7C3AED" strokeWidth={3} />
                    </View>

                    {/* Decorative Background Graphic */}
                    <View style={styles.decorativeIcon}>
                        <Sparkles size={110} color="rgba(255, 255, 255, 0.1)" strokeWidth={1} />
                    </View>
                </LinearGradient>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 12,
        borderRadius: 24,
        padding: 18,
        height: 120, // Reduced height for a more compact and modern look
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        ...Platform.select({
            ios: {
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    textContent: {
        flex: 1,
        marginRight: 10,
        zIndex: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.95)',
        lineHeight: 18,
        fontWeight: '500',
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    decorativeIcon: {
        position: 'absolute',
        right: -15,
        top: -15,
        zIndex: 1,
    },
});
