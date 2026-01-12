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
                <LinearGradient
                    colors={[module.accentColor + '1A', '#FFFFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.mainContainer, fullDescription && { paddingVertical: 20 }]}
                >
                    {/* Left: Icon */}
                    <View style={[styles.iconContainer, { borderColor: module.accentColor }]}>
                        <CategoryIcon scanType={scanType} size={22} color={module.accentColor} />
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
                </LinearGradient>
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
        flex: 1,
    },
    iconContainer: {
        width: 48, // Standardized with ToolsCarousel
        height: 48,
        borderRadius: 24,
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
        backgroundColor: '#F3F4F6', // Soft grey capsule
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4B5563',
    },
    arrowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
});
