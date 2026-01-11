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

    // Default gradient if not specified (though it is now required in types)
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
                end={{ x: 1, y: 0 }}
                style={styles.gradientContainer}
            >
                {/* Left: Icon */}
                <View style={[styles.iconContainer, { backgroundColor: module.accentColor }]}>
                    <IconComponent size={24} color="#FFFFFF" />
                </View>

                {/* Center: Content */}
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{module.name}</Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {module.description}
                    </Text>

                    <View style={styles.badgesContainer}>
                        {module.badges.map((badge, index) => (
                            <View key={index} style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {badge}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Right: Chevron */}
                <View style={styles.arrowContainer}>
                    <ChevronRight size={24} color="#9CA3AF" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchableWrapper: {
        marginBottom: 16,
        borderRadius: 24,
        // Drop Shadow applied to the wrapper
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        backgroundColor: 'transparent', // Important for shadow on iOS sometimes or just logic
    },
    gradientContainer: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6', // Subtle border
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 8,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white for badges on gradient
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#4B5563',
    },
    arrowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
