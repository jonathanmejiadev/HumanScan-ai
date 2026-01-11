import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScanType } from '@/types/analysis';
import { MODULES } from '@/constants/modules';
import { Camera } from 'lucide-react-native';

interface ModuleCardProps {
    scanType: ScanType;
    onPress: () => void;
}

export default function ModuleCard({ scanType, onPress }: ModuleCardProps) {
    const module = MODULES[scanType];

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: module.color }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: module.accentColor }]}>
                <Camera size={24} color="#FFFFFF" />
            </View>

            <Text style={styles.title}>{module.name}</Text>
            <Text style={styles.description}>{module.description}</Text>

            <View style={styles.badgesContainer}>
                {module.badges.map((badge, index) => (
                    <View key={index} style={styles.badge}>
                        <Text style={[styles.badgeText, { color: module.accentColor }]}>
                            {badge}
                        </Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        minHeight: 160,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 6,
    },
    description: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 12,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
});
