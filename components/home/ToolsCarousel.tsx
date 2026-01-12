import React, { useRef } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Pressable,
} from 'react-native';
import { Pill, Apple, FileText } from 'lucide-react-native';

interface ToolCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    onPress: () => void;
}

const ToolCard = ({ title, subtitle, icon, color, onPress }: ToolCardProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shadowAnim = useRef(new Animated.Value(0.12)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.97, // Adjusted to 0.97
                useNativeDriver: true,
                tension: 100,
                friction: 10,
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
                tension: 100,
                friction: 10,
            }),
            Animated.timing(shadowAnim, {
                toValue: 0.07,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    backgroundColor: '#FFFFFF',
                    borderColor: color + '26', // 15% opacity
                    shadowColor: '#000000',
                    shadowOpacity: shadowAnim,
                    transform: [{ scale: scaleAnim }],
                }
            ]}
        >
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.pressable}
            >
                <View style={styles.contentWrapper}>
                    <View style={[styles.iconCircle, { backgroundColor: color + '1A', borderColor: color }]}>
                        {React.cloneElement(icon as React.ReactElement<any>, { color, size: 28 })}
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardSubtitle}>{subtitle}</Text>
                    </View>
                </View>

                {/* Identity Bar */}
                <View style={[styles.identityBar, { backgroundColor: color }]} />
            </Pressable>
        </Animated.View>
    );
};

interface ToolsCarouselProps {
    onToolPress: (type: 'medication' | 'nutrition' | 'lab_results') => void;
}

const SECTION_MARGIN = 20;

export default function ToolsCarousel({ onToolPress }: ToolsCarouselProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Herramientas de Salud</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.toolScroll}
                contentContainerStyle={styles.scrollContent}
                snapToInterval={160} // card width + margin (144 + 16)
                decelerationRate="fast"
            >
                <ToolCard
                    title="Medicamentos"
                    subtitle="Verifica usos y dosis"
                    icon={<Pill />}
                    color="#0F9550"
                    onPress={() => onToolPress('medication')}
                />

                <ToolCard
                    title="Nutrición"
                    subtitle="Calorías y macros"
                    icon={<Apple />}
                    color="#FF970A"
                    onPress={() => onToolPress('nutrition')}
                />

                <ToolCard
                    title="Análisis"
                    subtitle="Interpreta lab. y PDFs"
                    icon={<FileText />}
                    color="#6366F1" // New Indigo Brand
                    onPress={() => onToolPress('lab_results')}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: SECTION_MARGIN,
        marginBottom: -20, // Offset shadow padding for vertical rhythm
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    toolScroll: {
        marginTop: -20,
        paddingVertical: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        width: 144,
        height: 126,
        borderRadius: 20,
        borderWidth: 1,
        // Elevation Shadows
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5,
    },
    pressable: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
    },
    textContainer: {
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 11,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 14,
    },
    identityBar: {
        position: 'absolute',
        bottom: 8,
        left: '25%',
        right: '25%',
        height: 3,
        borderRadius: 1.5,
    },
});
