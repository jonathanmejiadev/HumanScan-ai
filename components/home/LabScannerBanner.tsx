import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { FileText, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Props {
    onPress: () => void;
}

export default function LabScannerBanner({ onPress }: Props) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <LinearGradient
                colors={['#0EA5E9', '#0369A1']} // Sky Blue / Cyan
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.iconContainer}>
                    <FileText size={32} color="#FFFFFF" strokeWidth={2.5} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>Analizador de Estudios</Text>
                    <Text style={styles.subtitle}>
                        Interpreta análisis de sangre, orina y otros documentos PDF.
                    </Text>
                </View>

                <View style={styles.arrowContainer}>
                    <ChevronRight size={24} color="#FFFFFF" opacity={0.8} />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 12,
        marginBottom: 10,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    gradient: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        marginLeft: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 18,
    },
    arrowContainer: {
        marginLeft: 8,
    },
});
