import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SmartScanCardProps {
    onPress: () => void;
}

export default function SmartScanCard({ onPress }: SmartScanCardProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <View style={styles.iconContainer}>
                    <Shield size={28} color="#FFFFFF" />
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>Escaneo Inteligente</Text>
                    <Text style={styles.description}>
                        Nuestra IA procesa imágenes en segundos para brindarte una orientación preliminar.
                    </Text>
                </View>

                <View style={styles.decorativeIcon}>
                    <Plus size={80} color="rgba(255, 255, 255, 0.1)" strokeWidth={3} />
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
        padding: 24,
        minHeight: 160,
        overflow: 'hidden',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    content: {
        zIndex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 20,
        maxWidth: '85%',
    },
    decorativeIcon: {
        position: 'absolute',
        right: -20,
        bottom: -20,
    },
});
