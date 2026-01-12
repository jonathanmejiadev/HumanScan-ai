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

    const shadowAnim = useRef(new Animated.Value(0.1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.96,
                useNativeDriver: true,
            }),
            Animated.timing(shadowAnim, {
                toValue: 0.05,
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
                toValue: 0.1,
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
                style={[styles.touchableWrapper, { borderColor: module.accentColor + '1A' }]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <LinearGradient
                    colors={[module.accentColor + '26', '#FFFFFF']} // ~15% opacity to white
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[styles.mainContainer, fullDescription && { paddingVertical: 20 }]}
                >
                    {/* Left: Icon */}
                    <View style={[styles.iconContainer, { borderColor: module.accentColor + '20' }]}>
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
                                <View key={index} style={[styles.badge, { borderColor: module.accentColor + '33' }]}>
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
        borderWidth: 1.5,
        overflow: 'hidden',
    },
    mainContainer: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        // Small icon shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
        color: '#4B5563', // Intermediate grey
        lineHeight: 18,
        marginBottom: 8,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 0.5,
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
