import React from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Pill, Apple, FileText, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ToolCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    onPress: () => void;
}

const ToolCard = ({ title, subtitle, icon, color, onPress }: ToolCardProps) => (
    <TouchableOpacity
        style={[
            styles.card,
            {
                backgroundColor: color + '05',
                borderColor: color + '15',
                shadowColor: color,
            }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={styles.contentWrapper}>
            <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
                {React.cloneElement(icon as React.ReactElement<any>, { color, size: 24 })}
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

interface ToolsCarouselProps {
    onToolPress: (type: 'medication' | 'nutrition' | 'lab_results') => void;
}

export default function ToolsCarousel({ onToolPress }: ToolsCarouselProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Herramientas de Salud</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                snapToInterval={160} // card width + margin
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
                    color="#0A7AFF"
                    onPress={() => onToolPress('lab_results')}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        gap: 16,
    },
    card: {
        width: 144,
        height: 126, // Reduced height by 30%
        borderRadius: 20,
        padding: 12,
        borderWidth: 1,
        // Shadows (Glow effect)
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    contentWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
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
});
