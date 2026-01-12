import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ScanType } from '@/types/analysis';
import { MODULES } from '@/constants/modules';
import { Camera, HelpCircle, ChevronRight, Scan } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CategoryIcon from './CategoryIcon';

interface ModuleCardProps {
    scanType: ScanType;
    onPress: () => void;
    onHelpPress?: () => void;
    fullDescription?: boolean; // Prop to show full description without truncation
}



export default function ModuleCard({ scanType, onPress, onHelpPress, fullDescription = false }: ModuleCardProps) {
    const module = MODULES[scanType];
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Default gradient if not specified
    const gradientColors = module.gradientColors || ['#FFFFFF', '#FFFFFF'];

    const shadowAnim = useRef(new Animated.Value(0.07)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.96,
                useNativeDriver: true,
            }),
            Animated.timing(shadowAnim, {
                toValue: 0.04,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
            Animated.timing(shadowAnim, {
                toValue: 0.07,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <Animated.View style={{
            transform: [{ scale: scaleAnim }],
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: shadowAnim,
            shadowRadius: 10,
            elevation: 5,
        }}>
            <TouchableOpacity
                style={[styles.touchableWrapper, { borderColor: module.accentColor + '26' }]} // 15% opacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <View style={[styles.mainContainer, fullDescription && { paddingVertical: 20 }]}>
                    {/* Left: Icon */}
                    <View style={[styles.iconContainer, { borderColor: module.accentColor }]}>
                        <CategoryIcon scanType={scanType} size={24} color={module.accentColor} />
                    </View>

                    {/* Center: Content */}
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>{module.name}</Text>
                        <Text
                            style={styles.description}
                            numberOfLines={fullDescription ? undefined : 2}
                        >
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
                        <ChevronRight size={20} color="#9CA3AF" />
                    </View>

                    {/* Identity Bar */}
                    <View style={[styles.identityBar, { backgroundColor: module.accentColor }]} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    touchableWrapper: {
        marginBottom: 16,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        overflow: 'hidden',
    },
    mainContainer: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
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
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
        marginRight: 4,
    },
    identityBar: {
        position: 'absolute',
        bottom: 0,
        left: '15%',
        right: '15%',
        height: 3,
        borderRadius: 1.5,
    },
});
