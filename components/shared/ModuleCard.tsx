import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScanType } from '@/types/analysis';
import { MODULES } from '@/constants/modules';
import { Camera, HelpCircle, Eye, Smile, User, Hand, Activity, ChevronRight, Scan } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ModuleCardProps {
    scanType: ScanType;
    onPress: () => void;
    onHelpPress?: () => void;
}

const iconMap: Record<string, any> = {
    camera: Camera,
    eye: Eye,
    smile: Smile,
    user: User,
    hand: Hand,
    activity: Activity,
    scan: Scan,
};

export default function ModuleCard({ scanType, onPress, onHelpPress }: ModuleCardProps) {
    const module = MODULES[scanType];
    const IconComponent = iconMap[module.icon] || Camera;

    const gradientColors = module.gradientColors || ['#FFFFFF', '#FFFFFF'];

    return (
        <TouchableOpacity
            style={styles.touchableWrapper}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }} // Changed to diagonal for better grid look
                style={styles.gradientContainer}
            >
                {/* Top: Icon centered */}
                <View style={[styles.iconContainer, { backgroundColor: module.accentColor }]}>
                    <IconComponent size={28} color="#FFFFFF" />
                </View>

                {/* Bottom: Title and Tags */}
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{module.name}</Text>

                    {/* Description removed for compact grid view as requested */}

                    <View style={styles.badgesContainer}>
                        {module.badges.slice(0, 2).map((badge, index) => (
                            <View key={index} style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {badge}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchableWrapper: {
        flex: 1,
        borderRadius: 24,
        // Drop Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
        backgroundColor: '#FFFFFF',
    },
    gradientContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        minHeight: 160,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    contentContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 10,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.9)',
    },
    badgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#4B5563',
        textTransform: 'uppercase',
    },
});
