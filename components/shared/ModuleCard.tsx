import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScanType } from '@/types/analysis';
import { MODULES } from '@/constants/modules';
import { Camera, HelpCircle, Eye } from 'lucide-react-native';

interface ModuleCardProps {
    scanType: ScanType;
    onPress: () => void;
    onHelpPress?: () => void;
}

export default function ModuleCard({ scanType, onPress, onHelpPress }: ModuleCardProps) {
    const module = MODULES[scanType];
    const isSpecialized = scanType === 'skin' || scanType === 'ocular';

    // Use Eye icon for ocular, Camera for others
    const IconComponent = scanType === 'ocular' ? Eye : Camera;

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: module.color }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: module.accentColor }]}>
                    <IconComponent size={24} color="#FFFFFF" />
                </View>
                {isSpecialized && onHelpPress && (
                    <TouchableOpacity
                        style={styles.helpButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            onHelpPress();
                        }}
                        activeOpacity={0.7}
                    >
                        <HelpCircle size={20} color={module.accentColor} />
                    </TouchableOpacity>
                )}
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 6,
    },
    description: {
        fontSize: 13,
        color: '#374151',
        lineHeight: 18,
        marginBottom: 12,
        fontWeight: '600',
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
