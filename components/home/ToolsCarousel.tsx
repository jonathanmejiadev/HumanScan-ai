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
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
            {React.cloneElement(icon as React.ReactElement<any>, { color, size: 28 })}
        </View>

        <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>

        <View style={[styles.bottomBadge, { backgroundColor: color }]}>
            <ChevronRight size={12} color="#FFFFFF" strokeWidth={3} />
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
        height: 180,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        // Shadows
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    textContainer: {
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 16,
    },
    bottomBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
});
