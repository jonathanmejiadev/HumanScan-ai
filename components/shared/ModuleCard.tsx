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

    const shadowAnim = useRef(new Animated.Value(0.05)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.96,
                useNativeDriver: true,
            }),
            Animated.timing(shadowAnim, {
                toValue: 0.03,
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
                toValue: 0.05,
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
            elevation: 3,
        }}>
            <TouchableOpacity
                style={[
                    styles.touchableWrapper,
                    {
                        backgroundColor: module.accentColor + '0A', // 4% opacity tint
                        borderColor: module.accentColor + '26'    // 15% opacity border
                    }
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <View style={styles.identityBarWrapper}>
                    {/* Left Identity Bar */}
                    <View style={[styles.identityBar, { backgroundColor: module.accentColor }]} />

                    <View style={[styles.mainContainer, fullDescription && { paddingVertical: 20 }]}>
                        {/* Left: Icon */}
                        <View style={styles.iconContainer}>
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
                                    <View key={index} style={[styles.badge, { borderColor: module.accentColor + '40' }]}>
                                        <Text style={[styles.badgeText, { color: module.accentColor }]}>
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
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    touchableWrapper: {
        marginBottom: 16,
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
    },
    identityBarWrapper: {
        flexDirection: 'row',
        flex: 1,
    },
    identityBar: {
        width: 4,
        height: '100%',
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
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        // Subtle icon shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
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
        backgroundColor: '#FFFFFF', // Solid white
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 0.5,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    arrowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
});
